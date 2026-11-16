import { useRef, useEffect, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { Sparkles, ShieldCheck, HeartPulse, Globe, Send } from 'lucide-react'


const SUGGESTION_CHIPS = [
  'Build me a high-protein South Indian day',
  'What can I eat before a 6am run?',
  'Is my protein intake enough?',
  'How to boost iron absorption from Ragi or Sundal?',
]

const LANGUAGES = [
  { code: 'en-IN', name: 'English (India)' },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)' },
]

export function ChatPage() {
  const { messages, loading, sendMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [selectedLanguage, setSelectedLanguage] = useState('en-IN')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSendPrompt = (text: string) => {
    const langName = LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'
    const langPrefix = selectedLanguage !== 'en-IN' ? `[Respond in ${langName}] ` : ''
    sendMessage(`${langPrefix}${text}`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto pb-4">
      {/* ── Page Header (Matches PDF Page 9) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D1B89A]/40 shrink-0">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52] block mb-0.5">
            CONVERSATION
          </span>
          <h1 className="text-[26px] font-extrabold text-[#3B2A20] font-heading tracking-tight leading-tight">
            AI coach
          </h1>
          <p className="text-[12px] text-[#7B5E4A]">
            Ask anything about food, portions or safety. Every reply is filtered through your clinical profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Multilingual Selector (Module 9 Requirement) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#D1B89A] rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-[#7B5E4A]" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-[#3B2A20] font-semibold outline-none cursor-pointer text-xs"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ── Chat Messages Scroll Area ── */}
      <div className="flex-1 bg-white border border-[#D1B89A]/60 rounded-3xl p-5 overflow-y-auto shadow-xs flex flex-col justify-between">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center text-center p-6 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F2E7D5] border border-[#D1B89A] flex items-center justify-center text-[#7B5E4A] mb-3 shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-[17px] font-bold text-[#3B2A20] mb-1 font-heading">
              Ask your coach
            </h2>
            <p className="text-[12px] text-[#7B5E4A] mb-6 leading-relaxed">
              Replies use your profile, safety record and recent meals. Not medical advice.
            </p>

            {/* Prompt Chips (Matches PDF Page 9) */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {SUGGESTION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(chip)}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#D1B89A]/80 hover:border-[#7B5E4A] hover:bg-[#F2E7D5] text-[12px] font-semibold text-[#3B2A20] transition-all cursor-pointer text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} language={selectedLanguage} />
            ))}
            {loading && (
              <div className="flex items-center gap-2.5 py-3 text-[12px] font-semibold text-[#7B5E4A] animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-[#7B5E4A]" />
                <span>Consulting ICMR-NIN 2020 RDA & IFCT 2017 deterministic engine...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-3 border-t border-[#D1B89A]/40 mt-3">
          <ChatInput onSend={handleSendPrompt} loading={loading} language={selectedLanguage} />
          <p className="text-[10px] text-center text-[#A67C52] mt-2">
            NutriMind AI answers are backed by verified ICMR-NIN 2020 RDA and IFCT 2017 scientific guidelines.
          </p>
        </div>
      </div>
    </div>
  )
}
