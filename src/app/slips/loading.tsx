import { Skeleton, CardSkeleton } from '@/components/LoadingSkeleton'

export default function SlipsLoading() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </header>

      <div className="space-y-6">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex flex-col xl:flex-row gap-4">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-80 rounded-2xl" />
        </div>
      </div>

      <section>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      </section>
    </div>
  )
}
