import { useState, useEffect, type FormEvent } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'

interface ChatInputProps {
  onSend: (text: string) => void
  loading: boolean
  language?: string
}

export function ChatInput({ onSend, loading, language = 'en-US' }: ChatInputProps) {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setHasSpeechSupport(true)
    }
  }, [])

  const startVoiceInput = () => {
    if (!hasSpeechSupport) {
      alert('Voice input is not supported in this browser. Please use Google Chrome or Edge.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setText(prev => (prev ? `${prev} ${transcript}` : transcript))
      setIsListening(false)
    }

    recognition.start()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || loading) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-[#D1B89A]/60">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={isListening ? 'Listening to your voice... Speak now' : "Type your question..."}
        className="flex-1 px-4 py-2.5 bg-transparent text-[13.5px] text-[#3B2A20] placeholder:text-[#A67C52]/70 outline-none font-medium"
      />

      {/* Voice Mic Button (Module 9 Requirement) */}
      <button
        type="button"
        onClick={startVoiceInput}
        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse'
            : 'bg-[#FAF7F0] border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]'
        }`}
        title={isListening ? 'Listening...' : 'Voice Input (Module 9)'}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      </button>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="p-2.5 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white shadow-xs transition-all disabled:opacity-40 cursor-pointer"
      >
        <Send size={16} />
      </button>
    </form>
  )
}
