import asyncio
import time
from collections import defaultdict
import logging

logger = logging.getLogger("nutrimind.rate_limiter")


class RateLimiter:
    def __init__(self):
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._limits = {
            "groq": 28,
            "google": 14,
        }
        self._lock = asyncio.Lock()

    async def can_use(self, provider: str) -> bool:
        async with self._lock:
            now = time.time()
            window = [t for t in self._requests[provider] if now - t < 60]
            self._requests[provider] = window
            limit = self._limits.get(provider, 30)
            return len(window) < limit

    async def record(self, provider: str):
        async with self._lock:
            self._requests[provider].append(time.time())

    async def get_available_provider(self, preferred: str, fallback: str) -> str:
        if await self.can_use(preferred):
            return preferred
        logger.warning("Rate limit approaching for %s, falling back to %s", preferred, fallback)
        return fallback


rate_limiter = RateLimiter()
