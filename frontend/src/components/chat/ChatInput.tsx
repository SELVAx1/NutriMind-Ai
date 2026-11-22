import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'

interface ChatInputProps {
  onSend: (text: string) => void
  loading: boolean
  language?: string
}

export function ChatInput({ onSend, loading, language = 'en-IN' }: ChatInputProps) {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false)
  const [micError, setMicError] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    setHasSpeechSupport(supported)
  }, [])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
        recognitionRef.current = null
      }
    }
  }, [])

  const toggleVoiceInput = () => {
    setMicError('')

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    if (!hasSpeechSupport) {
      setMicError('Voice input is not supported in this browser. Use Chrome or Edge.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setMicError('')
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      recognitionRef.current = null
      if (event.error === 'not-allowed') {
        setMicError('Microphone access denied. Allow microphone in your browser settings.')
      } else if (event.error === 'no-speech') {
        setMicError('No speech detected. Try again.')
      } else if (event.error !== 'aborted') {
        setMicError(`Voice error: ${event.error}. Try again.`)
      }
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setText(prev => (prev ? `${prev} ${finalTranscript}` : finalTranscript))
      }
    }

    try {
      recognition.start()
    } catch {
      setMicError('Could not start voice input. Try again.')
      setIsListening(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || loading) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-[#D1B89A]/60">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={isListening ? 'Listening... speak now' : 'Type your question...'}
          className="flex-1 px-4 py-2.5 bg-transparent text-[13.5px] text-[#3B2A20] placeholder:text-[#A67C52]/70 outline-none font-medium"
          disabled={loading}
        />

        {hasSpeechSupport && (
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={loading}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#FAF7F0] border border-[#D1B89A] text-[#7B5E4A] hover:bg-[#F2E7D5]'
            } disabled:opacity-40`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}

        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="p-2.5 rounded-xl bg-[#7B5E4A] hover:bg-[#3B2A20] text-white shadow-xs transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
      {micError && (
        <p className="text-[11px] text-rose-600 mt-1.5 px-2 font-medium">{micError}</p>
      )}
    </div>
  )
}
