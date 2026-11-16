import httpx
from fastapi import Depends, HTTPException, Header
from app.config import get_settings
import logging

logger = logging.getLogger("nutrimind.auth")

_http_client: httpx.AsyncClient | None = None


def _get_http() -> httpx.AsyncClient:
    global _http_client
    if _http_client is None:
        _http_client = httpx.AsyncClient(timeout=10)
    return _http_client


async def get_current_user(authorization: str = Header(...)):
    settings = get_settings()

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization[7:]
    apikey = settings.vite_supabase_anon_key or settings.supabase_service_role_key

    if not apikey:
        raise HTTPException(status_code=500, detail="Supabase API key not configured")

    try:
        client = _get_http()
        resp = await client.get(
            f"{settings.supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": apikey,
            },
        )

        if resp.status_code != 200:
            logger.warning("Auth failed: %s %s", resp.status_code, resp.text[:200])
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user_data = resp.json()
        return {
            "id": user_data.get("id"),
            "email": user_data.get("email"),
            "role": user_data.get("role", "authenticated"),
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Auth error: %s", e)
        raise HTTPException(status_code=401, detail="Authentication failed")
