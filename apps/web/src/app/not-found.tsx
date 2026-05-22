import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-black text-brand-500">404</div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="px-6 py-2.5 border hover:bg-muted font-semibold rounded-xl transition-colors"
          >
            Browse assets
          </Link>
        </div>
      </div>
    </div>
  )
}
