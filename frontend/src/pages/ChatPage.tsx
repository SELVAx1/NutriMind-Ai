import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { Sparkles, MessageSquareText } from 'lucide-react'

const SUGGESTED = [
  'Why is iron important for vegetarians?',
  'What are affordable sources of protein?',
  'How can I improve my fibre intake?',
  'How much protein did I eat today?',
  'Is my current diet balanced?',
]

export function ChatPage() {
  const { messages, loading, sendMessage } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages])

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col rounded-xl border border-border bg-surface-1 shadow-[0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden"
           style={{ height: 'calc(100vh - 130px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 h-14 px-6 border-b border-border flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <MessageSquareText size={16} className="text-primary" />
          </div>
          <div>
            <h1 className="text-[14px] font-semibold text-text">Nutrition Assistant</h1>
            <p className="text-[11px] text-text-dim">Evidence-backed answers from ICMR & WHO guidelines</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-1.5">Hi! I'm NutriMind.</h2>
              <p className="text-[13px] text-text-muted mb-8 max-w-md leading-relaxed">
                I can answer nutrition questions with evidence from ICMR guidelines, analyze your intake, or suggest meal improvements.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="px-4 py-2 text-[12px] rounded-lg bg-surface-2 border border-border text-text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer font-medium">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map(m => <ChatMessage key={m.id} {...m} />)}
            </div>
          )}
          {loading && (
            <div className="max-w-3xl mx-auto flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">N</div>
              <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-surface-2">
                <div className="flex gap-1.5">
                  {[0, 150, 300].map(d => <div key={d} className="w-2 h-2 bg-text-dim rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-border">
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      </div>
    </div>
  )
}
