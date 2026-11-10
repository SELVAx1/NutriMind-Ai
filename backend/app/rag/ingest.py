from app.db.supabase_client import get_supabase
from app.ai.factory import embed_text
import logging

logger = logging.getLogger("nutrimind.rag")


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap
    return chunks


async def ingest_document(title: str, source: str, content: str, doc_type: str = "guideline", metadata: dict | None = None):
    sb = get_supabase()

    doc = sb.table("knowledge_documents").insert({
        "title": title,
        "source": source,
        "doc_type": doc_type,
    }).execute()

    doc_id = doc.data[0]["id"]
    chunks = chunk_text(content)

    for i, chunk in enumerate(chunks):
        embedding = await embed_text(chunk)
        sb.table("document_chunks").insert({
            "document_id": doc_id,
            "content": chunk,
            "embedding": embedding,
            "metadata": {**(metadata or {}), "chunk_index": i, "source": source, "title": title},
            "chunk_index": i,
        }).execute()

    logger.info("Ingested '%s': %d chunks", title, len(chunks))
    return doc_id
