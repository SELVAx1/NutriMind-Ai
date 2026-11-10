from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.supabase_auth import get_current_user
from app.agents.orchestrator import process_message
from app.db.supabase_client import get_supabase
import logging
import traceback

logger = logging.getLogger("nutrimind.chat")

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None


@router.post("/message")
async def send_message(req: ChatRequest, user=Depends(get_current_user)):
    try:
        sb = get_supabase()

        if req.conversation_id:
            convo_id = req.conversation_id
        else:
            convo = sb.table("conversations").insert({
                "user_id": user["id"],
                "title": req.message[:50],
            }).execute()
            data = convo.data
            if isinstance(data, list):
                convo_id = data[0]["id"]
            else:
                convo_id = data["id"]

        sb.table("chat_messages").insert({
            "conversation_id": convo_id,
            "role": "user",
            "content": req.message,
        }).execute()

        result = await process_message(user["id"], req.message, convo_id)

        sb.table("chat_messages").insert({
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
            "response": f"Something went wrong: {str(e)}",
            "citations": [],
            "route_type": "error",
            "conversation_id": req.conversation_id,
            "blocked": False,
        }


@router.get("/history/{conversation_id}")
async def get_history(conversation_id: str, user=Depends(get_current_user)):
    sb = get_supabase()
    messages = sb.table("chat_messages").select("*").eq("conversation_id", conversation_id).order("created_at").execute()
    return {"messages": messages.data if messages.data else []}


@router.get("/conversations")
async def list_conversations(user=Depends(get_current_user)):
    sb = get_supabase()
    convos = sb.table("conversations").select("*").eq("user_id", user["id"]).order("created_at", desc=True).limit(20).execute()
    return {"conversations": convos.data if convos.data else []}
