from collections.abc import AsyncIterator
from app.ai.groq_provider import GroqProvider
from app.ai.google_provider import GoogleProvider
from app.ai.rate_limiter import rate_limiter
from app.config import get_settings
import logging

logger = logging.getLogger("nutrimind.ai")

_groq: GroqProvider | None = None
_google: GoogleProvider | None = None


def _get_groq() -> GroqProvider:
    global _groq
    if _groq is None:
        _groq = GroqProvider()
    return _groq


def _get_google() -> GoogleProvider:
    global _google
    if _google is None:
        _google = GoogleProvider()
    return _google


async def generate_text(prompt: str, system: str = "", fast: bool = False, json_mode: bool = False) -> str:
    settings = get_settings()
    provider_name = await rate_limiter.get_available_provider(
        settings.llm_primary_provider, settings.llm_fallback_provider
    )

    try:
        if provider_name == "groq":
            await rate_limiter.record("groq")
            groq = _get_groq()
            if fast:
                return await groq.generate_fast(prompt, system)
            return await groq.generate(prompt, system, json_mode=json_mode)
        else:
            await rate_limiter.record("google")
            return await _get_google().generate(prompt, system)
    except Exception as e:
        logger.error("Primary provider %s failed: %s. Trying fallback.", provider_name, e)
        if provider_name == "groq":
            await rate_limiter.record("google")
            return await _get_google().generate(prompt, system)
        else:
            await rate_limiter.record("groq")
            return await _get_groq().generate(prompt, system, json_mode=json_mode)


async def generate_text_stream(prompt: str, system: str = "") -> AsyncIterator[str]:
    settings = get_settings()
    provider_name = await rate_limiter.get_available_provider(
        settings.llm_primary_provider, settings.llm_fallback_provider
    )

    try:
        if provider_name == "groq":
            await rate_limiter.record("groq")
            async for chunk in _get_groq().generate_stream(prompt, system):
                yield chunk
        else:
            await rate_limiter.record("google")
            result = await _get_google().generate(prompt, system)
            yield result
    except Exception as e:
        logger.error("Stream provider %s failed: %s. Falling back to non-stream.", provider_name, e)
        if provider_name == "groq":
            await rate_limiter.record("google")
            result = await _get_google().generate(prompt, system)
            yield result
        else:
            await rate_limiter.record("groq")
            result = await _get_groq().generate(prompt, system)
            yield result


async def analyze_image(image_bytes: bytes, prompt: str) -> str:
    await rate_limiter.record("google")
    return await _get_google().vision(image_bytes, prompt)


async def embed_text(text: str) -> list[float]:
    await rate_limiter.record("google")
    return await _get_google().embed(text)


async def embed_query(text: str) -> list[float]:
    await rate_limiter.record("google")
    return await _get_google().embed_query(text)
