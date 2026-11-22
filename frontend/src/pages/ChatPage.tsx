import { useRef, useEffect, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { Sparkles, Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en-IN', name: 'English', llmName: 'English' },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)', llmName: 'Hindi' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', llmName: 'Tamil' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', llmName: 'Telugu' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', llmName: 'Kannada' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', llmName: 'Bengali' },
]

export function ChatPage() {
  const { messages, loading, sendMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSendPrompt = (text: string) => {
    const lang = LANGUAGES.find(l => l.code === selectedLanguage)
    const langPrefix = selectedLanguage !== 'en-IN' && lang
      ? `[IMPORTANT: You MUST respond entirely in ${lang.llmName} language. Do not respond in English.] `
      : ''
    sendMessage(`${langPrefix}${text}`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto pb-4">
      {/* Page Header */}
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

      {/* Chat Messages */}
      <div className="flex-1 bg-white border border-[#D1B89A]/60 rounded-3xl p-5 overflow-y-auto shadow-xs flex flex-col justify-between">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center text-center p-6 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F2E7D5] border border-[#D1B89A] flex items-center justify-center text-[#7B5E4A] mb-3 shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-[17px] font-bold text-[#3B2A20] mb-1 font-heading">
              Ask your coach
            </h2>
            <p className="text-[12px] text-[#7B5E4A] leading-relaxed max-w-sm">
              Ask about nutrition, meal plans, food safety, or your daily intake. Replies use your profile and safety record. Not medical advice.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} language={selectedLanguage} />
            ))}
            {loading && !messages.some(m => m.streaming) && (
              <div className="flex items-center gap-2.5 py-3 text-[12px] font-semibold text-[#7B5E4A] animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-[#7B5E4A]" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-3 border-t border-[#D1B89A]/40 mt-3">
          <ChatInput onSend={handleSendPrompt} loading={loading} language={selectedLanguage} />
          <p className="text-[10px] text-center text-[#A67C52] mt-2">
            Answers are backed by ICMR-NIN 2020 RDA and IFCT 2017 guidelines.
          </p>
        </div>
      </div>
    </div>
  )
}
