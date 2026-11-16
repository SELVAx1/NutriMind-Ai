from abc import ABC, abstractmethod


class LLMProvider(ABC):

    @abstractmethod
    async def generate(self, prompt: str, system: str = "", model: str | None = None) -> str:
        """Generate text from a prompt."""

    @abstractmethod
    async def vision(self, image_bytes: bytes, prompt: str, model: str | None = None) -> str:
        """Analyze an image with a prompt."""

    @abstractmethod
    async def embed(self, text: str, model: str | None = None) -> list[float]:
        """Generate an embedding vector for text."""
