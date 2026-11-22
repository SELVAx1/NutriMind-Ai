import { useState, useEffect, useRef } from 'react'
import type { ChatMessageDef } from '@/hooks/useChat'
import { Sparkles, User, FileText, Volume2, VolumeX, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-[#F2E7D5] rounded text-[12px] font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$1. $2</li>')
    .replace(/\n/g, '<br/>')
}

function findVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const langPrefix = langCode.split('-')[0]

  let voice = voices.find(v => v.lang === langCode)
  if (!voice) voice = voices.find(v => v.lang.startsWith(langPrefix))
  if (!voice) voice = voices.find(v => v.lang.startsWith('en'))
  return voice || null
}

export function ChatMessage({ message, language = 'en-IN' }: { message: ChatMessageDef & { streaming?: boolean }; language?: string }) {
  const isAssistant = message.role === 'assistant'
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [, setVoicesLoaded] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const loadVoices = () => setVoicesLoaded(true)
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true)
    }
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [])

  const speakText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(message.content)
    utteranceRef.current = utterance

    utterance.lang = language
    utterance.rate = 0.95

    const voice = findVoiceForLanguage(language)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    }

    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
          isAssistant
            ? 'bg-[#7B5E4A] text-white shadow-xs'
            : 'bg-[#3B2A20] text-white'
        }`}
      >
        {isAssistant ? <Sparkles size={16} /> : <User size={16} />}
      </div>

      <div className={`max-w-[85%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-4 rounded-2xl text-[13.5px] leading-relaxed ${
            isAssistant
              ? 'bg-[#FAF7F0] border border-[#D1B89A] text-[#3B2A20]'
              : 'bg-[#7B5E4A] text-white font-medium shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="whitespace-pre-wrap break-words flex-1">
              {isAssistant ? (
                <>
                  <span dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
                  {message.streaming && <span className="inline-block w-1.5 h-4 bg-[#7B5E4A] animate-pulse ml-0.5 align-text-bottom rounded-sm" />}
                </>
              ) : (
                <>{message.content}</>
              )}
            </div>
            {isAssistant && (
              <button
                onClick={speakText}
                className="p-1 rounded-lg text-[#7B5E4A] hover:bg-[#F2E7D5] shrink-0 cursor-pointer transition-colors"
                title={isPlaying ? 'Stop reading' : 'Read aloud'}
              >
                {isPlaying ? <VolumeX size={15} className="text-rose-700" /> : <Volume2 size={15} />}
              </button>
            )}
          </div>

          {isAssistant && message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[#D1B89A]/50">
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[#A67C52] hover:text-[#3B2A20] cursor-pointer"
              >
                <ShieldCheck size={12} />
                <span>Sources & Evidence</span>
                {showExplanation ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {showExplanation && (
                <div className="mt-2 p-2.5 bg-white border border-[#D1B89A]/60 rounded-xl text-xs space-y-1.5 animate-in fade-in">
                  {message.citations.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-[#A67C52] font-semibold">
                      <FileText size={11} />
                      <span>{c.source} {c.section ? `— ${c.section}` : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
