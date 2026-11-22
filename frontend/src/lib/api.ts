import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_URL || ''
const DEFAULT_TIMEOUT = 30000
const LONG_TIMEOUT = 60000

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) {
    return { Authorization: `Bearer ${data.session.access_token}` }
  }
  return {}
}

function buildUrl(path: string): string {
  if (API_BASE && path.startsWith('/')) {
    return `${API_BASE}${path}`
  }
  return path
}

function createTimeout(ms: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeader()
  const timeout = createTimeout(DEFAULT_TIMEOUT)
  try {
    const res = await fetch(buildUrl(path), { headers, signal: timeout.signal })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`API error ${res.status}: ${text.slice(0, 200)}`)
    }
    return res.json()
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('Request timed out. Please check your backend connection.')
    }
    throw err
  } finally {
    timeout.clear()
  }
}

export async function apiPost<T>(path: string, body: unknown, long = false): Promise<T> {
  const headers = await getAuthHeader()
  const timeout = createTimeout(long ? LONG_TIMEOUT : DEFAULT_TIMEOUT)
  try {
    const res = await fetch(buildUrl(path), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: timeout.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`API error ${res.status}: ${text.slice(0, 200)}`)
    }
    return res.json()
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('Request timed out. Please check your backend connection.')
    }
    throw err
  } finally {
    timeout.clear()
  }
}
