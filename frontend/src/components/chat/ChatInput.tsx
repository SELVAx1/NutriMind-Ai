import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'

export function ChatInput({ onSend, loading }: { onSend: (msg: string) => void; loading: boolean }) {
  const [text, setText] = useState('')
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || loading) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={loading}
        placeholder="Ask about nutrition, your intake, or food..."
        className="flex-1 h-10 px-4 rounded-lg bg-surface-2 border border-border text-[13px] text-text placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
      />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-light transition-all cursor-pointer flex-shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
      >
        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
      </button>
    </form>
  )
}
