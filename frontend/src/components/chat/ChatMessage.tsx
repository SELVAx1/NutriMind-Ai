import { clsx } from 'clsx'
import { BookOpen } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  citations?: { source: string; title: string; similarity: number }[]
  route_type?: string
}

export function ChatMessage({ role, content, citations, route_type }: ChatMessageProps) {
  const isUser = role === 'user'
  return (
    <div className={clsx('flex gap-3 mb-5', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={clsx(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold',
        isUser ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
      )}>
        {isUser ? 'U' : 'N'}
      </div>
      <div className="max-w-[75%] flex flex-col gap-1.5">
        <div className={clsx(
          'px-4 py-3 text-[13px] leading-relaxed rounded-xl',
          isUser ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface-2 border border-border rounded-tl-sm'
        )}>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        {citations && citations.length > 0 && (
          <div className="flex flex-col gap-0.5 px-1">
            {citations.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-text-dim">
                <BookOpen size={10} className="text-primary flex-shrink-0" />
                <span className="truncate">{c.source} — {c.title}</span>
              </div>
            ))}
          </div>
        )}
        {route_type && !isUser && (
          <span className={clsx(
            'inline-block text-[9px] px-2 py-0.5 rounded font-semibold',
            route_type === 'rag' ? 'bg-violet-500/15 text-violet-400' :
            route_type === 'personal' ? 'bg-emerald-500/15 text-emerald-400' :
            route_type === 'safety' ? 'bg-red-500/15 text-red-400' :
            'bg-surface-3 text-text-dim'
          )}>
            {route_type === 'rag' ? 'Evidence-based' : route_type === 'personal' ? 'Your data' : route_type === 'safety' ? 'Safety' : route_type === 'action' ? 'Action' : 'General'}
          </span>
        )}
      </div>
    </div>
  )
}
