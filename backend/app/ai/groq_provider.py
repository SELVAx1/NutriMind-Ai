from groq import Groq
from app.ai.provider import LLMProvider
from app.config import get_settings


class GroqProvider(LLMProvider):

    def __init__(self):
        settings = get_settings()
        self.client = Groq(api_key=settings.groq_api_key)
        self.default_model = settings.groq_model_default
        self.fast_model = settings.groq_model_fast

    async def generate(self, prompt: str, system: str = "", model: str | None = None) -> str:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        response = self.client.chat.completions.create(
            model=model or self.default_model,
            messages=messages,
            temperature=0.7,
            max_tokens=2048,
        )
        return response.choices[0].message.content or ""

    async def generate_fast(self, prompt: str, system: str = "") -> str:
        return await self.generate(prompt, system, model=self.fast_model)

    async def vision(self, image_bytes: bytes, prompt: str, model: str | None = None) -> str:
        raise NotImplementedError("Groq does not support vision. Use Google provider.")

    async def embed(self, text: str, model: str | None = None) -> list[float]:
        raise NotImplementedError("Groq does not support embeddings. Use Google provider.")
