import httpx
from app.config import get_settings


class SupabaseClient:
    def __init__(self):
        settings = get_settings()
        self.base_url = settings.supabase_url
        self.api_key = settings.supabase_service_role_key
        self.headers = {
            "apikey": self.api_key,
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }
        self._http = httpx.AsyncClient(headers=self.headers, timeout=30)

    def table(self, name: str) -> "TableQuery":
        return TableQuery(self, name)

    async def rpc(self, function_name: str, params: dict) -> "RPCResult":
        url = f"{self.base_url}/rest/v1/rpc/{function_name}"
        resp = await self._http.post(url, json=params)
        resp.raise_for_status()
        return RPCResult(resp.json())


class TableQuery:
    def __init__(self, client: SupabaseClient, table: str):
        self._client = client
        self._table = table
        self._url = f"{client.base_url}/rest/v1/{table}"
        self._params: dict[str, str] = {}
        self._method = "GET"
        self._body: dict | list | None = None
        self._select_cols = "*"
        self._headers = dict(client.headers)

    def select(self, columns: str = "*") -> "TableQuery":
        self._select_cols = columns
        self._params["select"] = columns
        return self

    def insert(self, data: dict | list) -> "TableQuery":
        self._method = "POST"
        self._body = data
        return self

    def update(self, data: dict) -> "TableQuery":
        self._method = "PATCH"
        self._body = data
        return self

    def delete(self) -> "TableQuery":
        self._method = "DELETE"
        return self

    def eq(self, column: str, value) -> "TableQuery":
        self._params[column] = f"eq.{value}"
        return self

    def neq(self, column: str, value) -> "TableQuery":
        self._params[column] = f"neq.{value}"
        return self

    def gt(self, column: str, value) -> "TableQuery":
        self._params[column] = f"gt.{value}"
        return self

    def gte(self, column: str, value) -> "TableQuery":
        self._params[column] = f"gte.{value}"
        return self

    def lt(self, column: str, value) -> "TableQuery":
        self._params[column] = f"lt.{value}"
        return self

    def lte(self, column: str, value) -> "TableQuery":
        self._params[column] = f"lte.{value}"
        return self

    def ilike(self, column: str, pattern: str) -> "TableQuery":
        self._params[column] = f"ilike.{pattern}"
        return self

    def in_(self, column: str, values: list) -> "TableQuery":
        escaped = ",".join(str(v) for v in values)
        self._params[column] = f"in.({escaped})"
        return self

    def is_(self, column: str, value) -> "TableQuery":
        self._params[column] = f"is.{value}"
        return self

    def or_(self, filters: str) -> "TableQuery":
        self._params["or"] = f"({filters})"
        return self

    def order(self, column: str, desc: bool = False) -> "TableQuery":
        direction = "desc" if desc else "asc"
        self._params["order"] = f"{column}.{direction}"
        return self

    def limit(self, count: int) -> "TableQuery":
        self._params["limit"] = str(count)
        return self

    def maybe_single(self) -> "TableQuery":
        self._headers["Accept"] = "application/vnd.pgrst.object+json"
        # Set Prefer header cleanly — don't duplicate
        prefer = self._headers.get("Prefer", "return=representation")
        if "missing=default" not in prefer:
            prefer = prefer + ",missing=default"
        self._headers["Prefer"] = prefer
        return self

    def single(self) -> "TableQuery":
        self._headers["Accept"] = "application/vnd.pgrst.object+json"
        return self

    async def execute(self) -> "QueryResult":
        http = self._client._http
        if self._method == "GET":
            resp = await http.get(self._url, params=self._params, headers=self._headers)
        elif self._method == "POST":
            resp = await http.post(self._url, json=self._body, params=self._params, headers=self._headers)
        elif self._method == "PATCH":
            resp = await http.patch(self._url, json=self._body, params=self._params, headers=self._headers)
        elif self._method == "DELETE":
            resp = await http.delete(self._url, params=self._params, headers=self._headers)
        else:
            raise ValueError(f"Unknown method: {self._method}")

        if resp.status_code == 406:
            return QueryResult(None)

        resp.raise_for_status()

        try:
            data = resp.json()
        except Exception:
            return QueryResult(None)

        if isinstance(data, dict) and "code" in data:
            return QueryResult(None)

        return QueryResult(data)


class RPCResult:
    def __init__(self, data):
        self.data = data


class QueryResult:
    def __init__(self, data):
        self.data = data


_client: SupabaseClient | None = None


def get_supabase() -> SupabaseClient:
    global _client
    if _client is None:
        _client = SupabaseClient()
    return _client
