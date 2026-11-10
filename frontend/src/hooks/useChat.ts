import { useState } from 'react'
import { apiPost } from '@/lib/api'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: { source: string; title: string; similarity: number }[]
  route_type?: string
  blocked?: boolean
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function sendMessage(text: string) {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await apiPost<{
        response: string
        citations: { source: string; title: string; similarity: number }[]
        route_type: string
        conversation_id: string
        blocked: boolean
      }>('/api/chat/message', {
        message: text,
        conversation_id: conversationId,
      })

      setConversationId(res.conversation_id)

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.response,
        citations: res.citations,
        route_type: res.route_type,
        blocked: res.blocked,
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I couldn\'t process that request. Please check that the backend is running and your API keys are configured.',
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([])
    setConversationId(null)
  }

  return { messages, loading, sendMessage, clearChat }
}
