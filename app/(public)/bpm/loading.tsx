import { Skeleton } from '@/components/ui/skeleton'

export default function BpmLoading() {
  return (
    <div>
      <div className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      <div className="border-b border-border px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-7xl space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border p-6">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="mt-4 h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
              <Skeleton className="mt-6 h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
