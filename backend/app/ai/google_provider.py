import base64
import google.generativeai as genai
from app.ai.provider import LLMProvider
from app.config import get_settings


class GoogleProvider(LLMProvider):

    def __init__(self):
        settings = get_settings()
        genai.configure(api_key=settings.google_ai_api_key)
        self.default_model = settings.google_model_default
        self.embedding_model = settings.google_embedding_model

    async def generate(self, prompt: str, system: str = "", model: str | None = None) -> str:
        model_name = model or self.default_model
        gm = genai.GenerativeModel(model_name, system_instruction=system or None)
        response = gm.generate_content(prompt)
        return response.text or ""

    async def vision(self, image_bytes: bytes, prompt: str, model: str | None = None) -> str:
        model_name = model or self.default_model
        gm = genai.GenerativeModel(model_name)

        image_part = {
            "mime_type": "image/jpeg",
            "data": image_bytes,
        }

        response = gm.generate_content([prompt, image_part])
        return response.text or ""

    async def embed(self, text: str, model: str | None = None) -> list[float]:
        model_name = model or self.embedding_model
        result = genai.embed_content(
            model=f"models/{model_name}",
            content=text,
            task_type="retrieval_document",
            output_dimensionality=768,
        )
        return result["embedding"]

    async def embed_query(self, text: str) -> list[float]:
        result = genai.embed_content(
            model=f"models/{self.embedding_model}",
            content=text,
            task_type="retrieval_query",
            output_dimensionality=768,
        )
        return result["embedding"]
