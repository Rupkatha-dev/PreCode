"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth, logOut } from "@/lib/firebase"
import { EXERCISES } from "@/lib/exercises"

function getProgress(): number[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("precode-progress")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function CourseDashboard() {
  const [completed, setCompleted] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    setCompleted(getProgress())
    setMounted(true)

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  const completedCount = completed.length
  const progressPercent = (completedCount / EXERCISES.length) * 100

  function getCurrentExerciseId(): number {
    for (const ex of EXERCISES) {
      if (!completed.includes(ex.id)) return ex.id
    }
    return -1 // all done
  }

  const currentId = getCurrentExerciseId()
  const allDone = currentId === -1

  function getCardClass(exerciseId: number): string {
    if (completed.includes(exerciseId)) return "glass-card-done"
    if (exerciseId === currentId) return "glass-card-active"
    return "glass-card"
  }

  function getDotClass(exerciseId: number): string {
    if (completed.includes(exerciseId)) return "timeline-dot timeline-dot-done"
    if (exerciseId === currentId) return "timeline-dot timeline-dot-active"
    return "timeline-dot"
  }

  function isClickable(exerciseId: number): boolean {
    return completed.includes(exerciseId) || exerciseId === currentId
  }

  function getStatusLabel(exerciseId: number): string {
    if (completed.includes(exerciseId)) return "Completed"
    if (exerciseId === currentId) return "Current"
    return "Locked"
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ── Header / Navigation ──────────────────────────────── */}
      {mounted && user && (
        <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PreCode</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-neutral-800" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-sm font-medium text-neutral-300 hidden sm:block">
                {user.displayName || user.email}
              </span>
            </div>
            <button
              onClick={async () => {
                await logOut()
                router.push('/')
              }}
              className="text-sm font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 px-4 py-2 rounded-full hover:bg-neutral-800 hover:text-white transition-all shadow-md"
            >
              Log out
            </button>
          </div>
        </header>
      )}

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background orb */}
        <div
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-4">
              AI-Powered Learning
            </p>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
              <span className="gradient-text">PreCode</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed">
              Think before you type. A structured course that teaches you to
              plan, specify, and reflect on every function you write.
            </p>
          </div>

          {/* Progress bar */}
          {mounted && (
            <div className="mt-10 animate-fade-up delay-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                <span>Course Progress</span>
                <span>
                  {completedCount} / {EXERCISES.length} completed
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="progress-bar-fill h-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Exercise Timeline ──────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[5px] top-4 bottom-4 timeline-line hidden sm:block"
            aria-hidden="true"
          />

          <div className="space-y-4">
            {EXERCISES.map((ex, idx) => {
              const clickable = isClickable(ex.id)
              const status = getStatusLabel(ex.id)
              const isDone = completed.includes(ex.id)
              const isCurrent = ex.id === currentId
              const delayClass = `delay-${idx + 2}`

              const card = (
                <div
                  className={`animate-fade-up ${delayClass} flex items-start gap-5`}
                >
                  {/* Timeline dot */}
                  <div className="pt-5 hidden sm:flex flex-col items-center">
                    <div className={getDotClass(ex.id)} />
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 ${getCardClass(ex.id)} p-5 ${
                      clickable ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-xs font-bold text-neutral-600">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-base font-semibold truncate">
                            {ex.title}
                          </h3>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
                          {ex.prompt}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span
                            className={`badge ${
                              ex.difficulty === "beginner"
                                ? "badge-beginner"
                                : "badge-intermediate"
                            }`}
                          >
                            {ex.difficulty}
                          </span>
                          {ex.concepts.map((c) => (
                            <span key={c} className="badge badge-concept">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status icon */}
                      <div className="flex-shrink-0 mt-1">
                        {isDone && (
                          <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                        {isCurrent && (
                          <div className="w-8 h-8 rounded-full bg-violet-500/15 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-violet-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        )}
                        {!isDone && !isCurrent && (
                          <div className="w-8 h-8 rounded-full bg-neutral-800/50 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-neutral-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom action row for current */}
                    {isCurrent && (
                      <div className="mt-4 pt-3 border-t border-violet-500/15 flex items-center justify-between">
                        <span className="text-xs text-violet-400 font-medium">
                          Ready to start
                        </span>
                        <span className="text-xs text-violet-400/60">
                          Click to begin &rarr;
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )

              return clickable ? (
                <Link
                  key={ex.id}
                  href={`/exercise/${ex.id}`}
                  className="block no-underline text-white"
                >
                  {card}
                </Link>
              ) : (
                <div key={ex.id}>{card}</div>
              )
            })}
          </div>
        </div>

        {/* All done CTA */}
        {mounted && allDone && (
          <div className="mt-12 text-center animate-fade-up">
            <Link href="/complete" className="btn-primary inline-block no-underline">
              View Course Summary
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
