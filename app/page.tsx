import Link from "next/link"

export default function Landing() {
  return (
    <main className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">PreCode</h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            A minimalist educational platform that enforces a structured workflow. Plan your logic, specify behavior, and think before you type.
          </p>
        </div>
        
        <div>
          <Link
            href="/exercise"
            className="inline-block px-8 py-3 bg-white text-black hover:bg-neutral-200 rounded-sm font-medium transition-colors"
          >
            Start Exercise
          </Link>
        </div>
      </div>
    </main>
  )
}
