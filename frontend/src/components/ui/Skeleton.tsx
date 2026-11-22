import clsx from 'clsx'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-xl bg-[#D1B89A]/30',
        className
      )}
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <Skeleton className="h-40 w-full rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>

      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  )
}

export function TrackerSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      <Skeleton className="h-36 w-full rounded-2xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto pb-4">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#D1B89A]/40">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-28" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      <div className="flex-1 bg-white border border-[#D1B89A]/60 rounded-3xl p-5">
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
              <Skeleton className={`h-16 rounded-2xl ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
