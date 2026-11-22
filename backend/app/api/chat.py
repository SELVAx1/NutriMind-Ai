import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.agents.orchestrator import process_message, classify_intent, extract_language_instruction, build_lang_system_suffix
from app.middleware.safety import check_safety
from app.db.supabase_client import get_supabase
from app.ai.factory import generate_text_stream
from app.rag.retriever import retrieve_chunks
from app.rag.context_builder import build_rag_context
import logging
import traceback

logger = logging.getLogger("nutrimind.chat")

router = APIRouter(prefix="/api/chat", tags=["chat"])


class HistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    history: list[HistoryMessage] | None = None

    def validated_message(self) -> str:
        msg = self.message.strip()
        if len(msg) > 4000:
            msg = msg[:4000]
        return msg

    def get_history_context(self) -> str:
        if not self.history:
            return ""
        lines = []
        for h in self.history[-6:]:
            role = "User" if h.role == "user" else "Assistant"
            lines.append(f"{role}: {h.content[:300]}")
        return "\n".join(lines)


@router.post("/message")
async def send_message(req: ChatRequest, user=Depends(get_current_user)):
    try:
        message = req.validated_message()
        if not message:
            return {"response": "Please enter a message.", "citations": [], "route_type": "error", "conversation_id": None, "blocked": False}

        sb = get_supabase()

        if req.conversation_id:
            convo_id = req.conversation_id
        else:
            convo = await sb.table("conversations").insert({
                "user_id": user["id"],
                "title": message[:50],
            }).execute()
            data = convo.data
            if isinstance(data, list):
                convo_id = data[0]["id"]
            else:
                convo_id = data["id"]

        await sb.table("chat_messages").insert({
            "conversation_id": convo_id,
            "role": "user",
            "content": message,
        }).execute()

        result = await process_message(user["id"], message, convo_id)

        await sb.table("chat_messages").insert({
            "conversation_id": convo_id,
            "role": "assistant",
            "content": result["response"],
            "citations": result.get("citations", []),
            "route_type": result.get("route_type", "general"),
        }).execute()

        return {
            "response": result["response"],
            "citations": result.get("citations", []),
            "route_type": result.get("route_type", "general"),
            "conversation_id": convo_id,
            "blocked": result.get("blocked", False),
        }

    except Exception as e:
        logger.error("Chat error: %s\n%s", e, traceback.format_exc())
        return {
            "response": "Something went wrong. Please try again.",
            "citations": [],
            "route_type": "error",
            "conversation_id": req.conversation_id,
            "blocked": False,
        }


@router.post("/stream")
async def stream_message(req: ChatRequest, user=Depends(get_current_user)):
    message = req.validated_message()
    if not message:
        return {"error": "Empty message"}

    clean_message, lang = extract_language_instruction(message)

    safety = check_safety(clean_message)
    if safety:
        async def safety_gen():
            yield f"data: {json.dumps({'type': 'token', 'content': safety['message']})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'route_type': 'safety'})}\n\n"
        return StreamingResponse(safety_gen(), media_type="text/event-stream")

    sb = get_supabase()
    if req.conversation_id:
        convo_id = req.conversation_id
    else:
        convo = await sb.table("conversations").insert({
            "user_id": user["id"],
            "title": clean_message[:50],
        }).execute()
        data = convo.data
        convo_id = data[0]["id"] if isinstance(data, list) else data["id"]

    await sb.table("chat_messages").insert({
        "conversation_id": convo_id,
        "role": "user",
        "content": message,
    }).execute()

    intent = await classify_intent(clean_message)
    lang_suffix = build_lang_system_suffix(lang)
    history_context = req.get_history_context()

    async def event_stream():
        full_response = ""

        yield f"data: {json.dumps({'type': 'start', 'conversation_id': convo_id, 'route_type': intent})}\n\n"

        try:
            history_block = ""
            if history_context:
                history_block = f"\n\nRecent conversation:\n{history_context}\n\nUser's latest message: "

            if intent == "rag":
                profile = await sb.table("user_profiles").select("*").eq("user_id", user["id"]).maybe_single().execute()
                chunks = await retrieve_chunks(clean_message, top_k=5)
                context = build_rag_context(query=clean_message, chunks=chunks, user_profile=profile.data)
                if history_block:
                    context += f"\n\n{history_block}{clean_message}"
                system = None
                if lang and lang.lower() != 'english':
                    system = f"You are NutriMind AI. Respond entirely in {lang}. Keep numbers and scientific terms intact."

                async for token in generate_text_stream(context, system=system or ""):
                    full_response += token
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

                citations = [{"source": c.get("metadata", {}).get("source", ""), "title": c.get("metadata", {}).get("title", "")} for c in chunks]
                if citations:
                    yield f"data: {json.dumps({'type': 'citations', 'citations': citations})}\n\n"

            elif intent == "general":
                system = f"You are NutriMind AI, a friendly nutrition assistant for Indian food. Keep responses brief, warm, and helpful.{lang_suffix}"
                prompt = f"{history_block}{clean_message}" if history_block else clean_message
                async for token in generate_text_stream(prompt, system=system):
                    full_response += token
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

            else:
                from app.agents.orchestrator import process_message as pm
                result = await pm(user["id"], message, convo_id)
                full_response = result.get("response", "")
                yield f"data: {json.dumps({'type': 'token', 'content': full_response})}\n\n"
                if result.get("citations"):
                    yield f"data: {json.dumps({'type': 'citations', 'citations': result['citations']})}\n\n"

        except Exception as e:
            logger.error("Stream error: %s", e)
            full_response = "Sorry, something went wrong. Please try again."
            yield f"data: {json.dumps({'type': 'token', 'content': full_response})}\n\n"

        try:
            await sb.table("chat_messages").insert({
                "conversation_id": convo_id,
                "role": "assistant",
                "content": full_response,
                "route_type": intent,
            }).execute()
        except Exception:
            pass

        yield f"data: {json.dumps({'type': 'done', 'route_type': intent})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


class AnalyzeRequest(BaseModel):
    message: str


@router.post("/analyze")
async def analyze_only(req: AnalyzeRequest, user=Depends(get_current_user)):
    try:
        from app.ai.factory import generate_text
        response = await generate_text(req.message, system="You are NutriMind AI, a nutrition analysis engine for Indian food. Respond concisely.")
        return {"response": response}
    except Exception as e:
        logger.error("Analyze error: %s", e)
        return {"response": "Analysis failed. Please try again."}


@router.get("/history/{conversation_id}")
async def get_history(conversation_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    convo = await sb.table("conversations").select("id").eq("id", conversation_id).eq("user_id", user["id"]).maybe_single().execute()
    if not convo.data:
        return {"messages": []}
    messages = await sb.table("chat_messages").select("*").eq("conversation_id", conversation_id).order("created_at").execute()
    return {"messages": messages.data if messages.data else []}


@router.get("/conversations")
async def list_conversations(user=Depends(get_current_user)):
    sb = get_supabase()
    convos = await sb.table("conversations").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(20).execute()
    return {"conversations": convos.data if convos.data else []}
