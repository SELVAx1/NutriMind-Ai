import { supabase } from './supabase'

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) {
    return { Authorization: `Bearer ${data.session.access_token}` }
  }
  return {}
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeader()
  const res = await fetch(path, { headers })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeader()
  const res = await fetch(path, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
