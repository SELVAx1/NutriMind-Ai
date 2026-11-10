from app.rag.retriever import retrieve_chunks
from app.rag.context_builder import build_rag_context
from app.ai.factory import generate_text
from app.db.supabase_client import get_supabase
import logging

logger = logging.getLogger("nutrimind.knowledge_agent")


async def handle_rag_query(user_id: str, query: str) -> dict:
    sb = get_supabase()
    profile = sb.table("user_profiles").select("*").eq("user_id", user_id).maybe_single().execute()

    chunks = await retrieve_chunks(query, top_k=5)

    context = build_rag_context(
        query=query,
        chunks=chunks,
        user_profile=profile.data,
    )

    response = await generate_text(context)

    citations = []
    for chunk in chunks:
        meta = chunk.get("metadata", {})
        citations.append({
            "source": meta.get("source", "Unknown"),
            "title": meta.get("title", ""),
            "similarity": round(chunk.get("similarity", 0), 3),
        })

    if not chunks:
        response += "\n\nNote: I couldn't find specific evidence in my knowledge base for this question. The above is based on general nutrition knowledge."

    return {
        "response": response,
        "citations": citations,
        "route_type": "rag",
    }
