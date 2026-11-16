import { useState, useEffect } from 'react'
import { apiPost, apiGet } from '@/lib/api'

export interface ChatMessageDef {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: { source: string; text?: string; section?: string }[]
  created_at?: string
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessageDef[]>([])
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  useEffect(() => {
    // Try to load latest conversation history if exists
    apiGet<{ conversations: { id: string }[] }>('/api/chat/conversations')
      .then(res => {
        if (res.conversations && res.conversations.length > 0) {
          const latestId = res.conversations[0].id
          setConversationId(latestId)
          apiGet<{ messages: any[] }>(`/api/chat/history/${latestId}`)
            .then(hist => {
              if (hist.messages && hist.messages.length > 0) {
                setMessages(hist.messages.map(m => ({
                  id: m.id || String(Math.random()),
                  role: m.role,
                  content: m.content,
                  citations: m.citations,
                  created_at: m.created_at,
                })))
              }
            })
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  async function sendMessage(content: string) {
    const userMsg: ChatMessageDef = {
      id: String(Date.now()),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await apiPost<{
        response?: string
        reply?: string
        citations?: { source: string; text?: string; section?: string }[]
        conversation_id?: string
        session_id?: string
      }>(
        '/api/chat/message',
        { message: content, conversation_id: conversationId }
      )

      if (res.conversation_id) setConversationId(res.conversation_id)

      const answerText = res.response || res.reply
      if (!answerText) throw new Error('Empty response from AI')

      const assistantMsg: ChatMessageDef = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: answerText,
        citations: res.citations && res.citations.length > 0 ? res.citations : undefined,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'Could not reach the AI service. Please make sure the backend server is running on port 8000 and try again.',
          citations: undefined,
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, sendMessage }
}
