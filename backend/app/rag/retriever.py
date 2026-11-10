from app.db.supabase_client import get_supabase
from app.ai.factory import embed_query
import logging

logger = logging.getLogger("nutrimind.rag")


async def retrieve_chunks(query: str, top_k: int = 5, threshold: float = 0.3) -> list[dict]:
    query_embedding = await embed_query(query)
    sb = get_supabase()

    result = sb.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_threshold": threshold,
        "match_count": top_k,
    })

    if result.data:
        logger.info("Retrieved %d chunks for: '%s'", len(result.data), query[:50])
        return result.data

    logger.info("No chunks above threshold for: '%s'", query[:50])
    return []
