import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export interface ChatMessageDef {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: { source: string; text?: string; section?: string }[]
  created_at?: string
  streaming?: boolean
}

const API_BASE = import.meta.env.VITE_API_URL || ''

function buildUrl(path: string): string {
  if (API_BASE && path.startsWith('/')) return `${API_BASE}${path}`
  return path
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessageDef[]>([])
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessageDef = {
      id: String(Date.now()),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const assistantId = String(Date.now() + 1)

    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
      created_at: new Date().toISOString(),
    }])

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const streamTimeout = setTimeout(() => controller.abort(), 45000)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) throw new Error('Not authenticated')

      const recentHistory = messagesRef.current
        .filter(m => !m.streaming)
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content.slice(0, 300) }))

      const res = await fetch(buildUrl('/api/chat/stream'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: content, conversation_id: conversationId, history: recentHistory }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let citations: ChatMessageDef['citations'] = undefined

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))

            if (event.type === 'start' && event.conversation_id) {
              setConversationId(event.conversation_id)
            } else if (event.type === 'token') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + event.content }
                  : m
              ))
            } else if (event.type === 'citations') {
              citations = event.citations
            } else if (event.type === 'done') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, streaming: false, citations }
                  : m
              ))
            }
          } catch {}
        }
      }

      clearTimeout(streamTimeout)
      setMessages(prev => prev.map(m =>
        m.id === assistantId && m.streaming
          ? { ...m, streaming: false, citations }
          : m
      ))

    } catch (err) {
      clearTimeout(streamTimeout)
      if ((err as Error).name === 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: m.content || 'Request timed out. The AI service may be slow or unavailable. Try again.', streaming: false }
            : m
        ))
        setLoading(false)
        return
      }

      setMessages(prev => {
        const existing = prev.find(m => m.id === assistantId)
        if (existing && existing.content) {
          return prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
        }
        return prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Could not reach the AI service. Please make sure the backend is running.', streaming: false }
            : m
        )
      })
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [conversationId])

  const clearChat = useCallback(() => {
    setMessages([])
    setConversationId(null)
  }, [])

  return { messages, loading, sendMessage, clearChat }
}
