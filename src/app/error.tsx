'use client'

import ErrorDisplay from '@/components/ErrorDisplay'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-20">
      <ErrorDisplay error={error} reset={reset} />
    </div>
  )
}
