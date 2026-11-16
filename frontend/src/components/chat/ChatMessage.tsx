import { useState } from 'react'
import type { ChatMessageDef } from '@/hooks/useChat'
import { Sparkles, User, FileText, Volume2, VolumeX, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'

export function ChatMessage({ message, language = 'en-US' }: { message: ChatMessageDef; language?: string }) {
  const isAssistant = message.role === 'assistant'
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const speakText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.')
      return
    }

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(message.content)
    utterance.lang = language
    utterance.rate = 1.0
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
            <p className="whitespace-pre-wrap">{message.content}</p>
            {isAssistant && (
              <button
                onClick={speakText}
                className="p-1 rounded-lg text-[#7B5E4A] hover:bg-[#F2E7D5] shrink-0 cursor-pointer transition-colors"
                title={isPlaying ? 'Stop voice playback' : 'Read aloud (Voice Assistant)'}
              >
                {isPlaying ? <VolumeX size={15} className="text-rose-700" /> : <Volume2 size={15} />}
              </button>
            )}
          </div>

          {/* Module 11: Explainable AI Accordion */}
          {isAssistant && (
            <div className="mt-3 pt-2.5 border-t border-[#D1B89A]/50">
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[#A67C52] hover:text-[#3B2A20] cursor-pointer"
              >
                <ShieldCheck size={12} />
                <span>Explainable AI • Clinical Evidence</span>
                {showExplanation ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {showExplanation && (
                <div className="mt-2 p-2.5 bg-white border border-[#D1B89A]/60 rounded-xl text-xs space-y-1.5 animate-in fade-in">
                  <p className="text-[11px] text-[#7B5E4A]">
                    <strong className="text-[#3B2A20]">Scientific Basis: </strong>
                    Filtered through ICMR-NIN 2020 RDA tables and IFCT 2017 deterministic nutrient composition values. Cross-checked with patient's registered allergen profile.
                  </p>
                  {message.citations && message.citations.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {message.citations.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-[#A67C52] font-semibold">
                          <FileText size={11} />
                          <span>{c.source} {c.section ? `• ${c.section}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
