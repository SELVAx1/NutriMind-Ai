import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { MessageCircle } from 'lucide-react'

const SUGGESTED_QUESTIONS = [
  'Why is iron important?',
  'What are affordable sources of protein?',
  'How can I improve fibre intake?',
  'How much protein did I eat today?',
  'Is my diet balanced?',
]

export function ChatPage() {
  const { messages, loading, sendMessage } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="py-3 border-b border-border mb-0">
        <h1 className="text-lg font-heading font-bold flex items-center gap-2">
          <MessageCircle size={20} className="text-primary" />
          Nutrition Assistant
        </h1>
        <p className="text-xs text-text-muted">Ask questions about nutrition, your intake, or Indian food.</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 px-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-primary" />
            </div>
            <h2 className="font-heading font-bold text-xl mb-2">Hi! I'm NutriMind.</h2>
            <p className="text-sm text-text-secondary mb-8 max-w-md">
              I can answer nutrition questions with evidence from ICMR guidelines, or tell you about your own intake.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-xl">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-4 py-2 text-sm rounded-full border border-border text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                citations={msg.citations}
                route_type={msg.route_type}
              />
            ))}
          </div>
        )}

        {loading && (
          <div className="max-w-3xl mx-auto flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-border-light flex items-center justify-center text-xs font-bold text-primary">N</div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  )
}
