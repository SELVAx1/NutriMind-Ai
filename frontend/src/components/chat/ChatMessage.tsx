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
    <div className={clsx('flex gap-3 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
        isUser ? 'bg-primary text-white' : 'bg-border-light text-primary'
      )}>
        {isUser ? 'U' : 'N'}
      </div>
      <div className={clsx('max-w-[80%] space-y-2', isUser ? 'items-end' : 'items-start')}>
        <div className={clsx(
          'px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm'
        )}>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>

        {citations && citations.length > 0 && (
          <div className="space-y-1">
            {citations.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <BookOpen size={12} className="text-primary flex-shrink-0" />
                <span className="truncate">{c.source} — {c.title}</span>
              </div>
            ))}
          </div>
        )}

        {route_type && !isUser && (
          <span className={clsx(
            'text-[10px] px-2 py-0.5 rounded-full',
            route_type === 'rag' ? 'bg-blue-50 text-protein' :
            route_type === 'personal' ? 'bg-green-50 text-primary' :
            route_type === 'safety' ? 'bg-red-50 text-danger' :
            'bg-gray-50 text-text-muted'
          )}>
            {route_type === 'rag' ? 'Evidence-based' :
             route_type === 'personal' ? 'Your data' :
             route_type === 'safety' ? 'Safety' :
             route_type === 'action' ? 'Action' : 'General'}
          </span>
        )}
      </div>
    </div>
  )
}
