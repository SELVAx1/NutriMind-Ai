import { useState } from 'react'
import { Sparkles, HeartPulse, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface NotificationsPopoverProps {
  isOpen: boolean
  onClose: () => void
}

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  link?: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = []

export function NotificationsPopover({ isOpen, onClose }: NotificationsPopoverProps) {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

  if (!isOpen) return null

  function markAllRead() {
    setItems(items.map(i => ({ ...i, read: true })))
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute right-0 top-13 z-50 w-80 sm:w-96 rounded-3xl bg-white border border-[#D1B89A] shadow-[0_20px_50px_rgba(59,42,32,0.12)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D1B89A]/40 bg-[#FAF7F0]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#7B5E4A]" />
            <span className="card-title text-[15px] font-bold text-[#3B2A20]">Health Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[11px] text-[#7B5E4A] font-bold hover:underline cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#7B5E4A] hover:text-[#3B2A20] hover:bg-white cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#D1B89A]/30 max-h-80 overflow-y-auto">
          {items.length === 0 && (
            <div className="p-8 text-center">
              <Sparkles size={24} className="text-[#D1B89A] mx-auto mb-2" />
              <p className="text-[12px] font-semibold text-[#7B5E4A]">No notifications yet</p>
              <p className="text-[11px] text-[#A67C52] mt-1">Health tips and alerts will appear here as you use the app.</p>
            </div>
          )}
          {items.map(item => (
            <Link
              key={item.id}
              to={item.link || '#'}
              onClick={onClose}
              className={`p-4 flex items-start gap-3 hover:bg-[#FAF7F0] transition-colors block ${
                !item.read ? 'bg-[#F2E7D5]/30' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#F2E7D5] text-[#7B5E4A] flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[12px] font-bold text-[#3B2A20]">{item.title}</h4>
                  <span className="text-[10px] text-[#7B5E4A]">{item.time}</span>
                </div>
                <p className="card-subtitle text-[11.5px] text-[#7B5E4A] leading-relaxed">{item.message}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-3 bg-[#FAF7F0] border-t border-[#D1B89A]/40 text-center">
          <Link
            to="/chat"
            onClick={onClose}
            className="text-[11px] font-bold text-[#7B5E4A] hover:underline"
          >
            Ask AI Nutritionist about your alerts →
          </Link>
        </div>
      </div>
    </>
  )
}
