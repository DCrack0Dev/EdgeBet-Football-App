import ErrorDisplay from '@/components/ErrorDisplay'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20">
      <ErrorDisplay 
        title="404 - Page Not Found"
        message="The insights you're looking for aren't here. This fixture might have been moved or archived."
      />
    </div>
  )
}
