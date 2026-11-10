import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  loading: boolean
}

export function ChatInput({ onSend, loading }: ChatInputProps) {
  const [text, setText] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || loading) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 py-4 border-t border-border">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about nutrition, your intake, or food..."
        className="flex-1 px-5 py-3 rounded-2xl border border-border bg-card text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-light transition-colors cursor-pointer flex-shrink-0"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send size={20} />
        )}
      </button>
    </form>
  )
}
