"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { EXERCISES } from "@/lib/exercises"

function getProgress(): number[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("precode-progress")
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function resetProgress() {
  localStorage.removeItem("precode-progress")
}

export default function CompletePage() {
  const [completed, setCompleted] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCompleted(getProgress())
    setMounted(true)
  }, [])

  const allDone = completed.length === EXERCISES.length
  const completedCount = completed.length

  return (
    <main className="min-h-screen bg-orange-50 text-gray-900 flex flex-col">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.4), transparent 70%)" }} />
        <div className="absolute bottom-[20%] right-[15%] w-[300px] h-[300px] rounded-full opacity-15 blur-[100px]" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.3), transparent 70%)" }} />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          {/* Animated checkmark */}
          {mounted && allDone && (
            <div className="mb-8 animate-check-pop">
              <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          <div className="animate-fade-up delay-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
              {allDone ? (
                <span className="gradient-text">Course Complete!</span>
              ) : (
                "Course Progress"
              )}
            </h1>
            <p className="text-gray-600 text-base mb-10 leading-relaxed">
              {allDone
                ? "You have completed all exercises. You practiced the think-first approach across strings, arrays, conditionals, and recursion."
                : `You have completed ${completedCount} of ${EXERCISES.length} exercises. Keep going!`}
            </p>
          </div>

          {/* Stats cards */}
          <div className="animate-fade-up delay-3 grid grid-cols-3 gap-3 mb-10">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{completedCount}</div>
              <div className="text-xs text-gray-500 mt-1">Exercises</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{completedCount * 3}</div>
              <div className="text-xs text-gray-500 mt-1">Phases</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{completedCount}</div>
              <div className="text-xs text-gray-500 mt-1">Reflections</div>
            </div>
          </div>

          {/* Exercise checklist */}
          <div className="animate-fade-up delay-4 glass-card p-5 mb-10 text-left">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Exercises</h3>
            <div className="space-y-3">
              {EXERCISES.map((ex) => {
                const done = completed.includes(ex.id)
                return (
                  <div key={ex.id} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-500/15 border border-green-500/30" : "bg-gray-100 border border-gray-300"}`}>
                      {done && <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm ${done ? "text-gray-900" : "text-gray-500"}`}>{ex.title}</span>
                    <span className={`badge ml-auto ${ex.difficulty === "beginner" ? "badge-beginner" : "badge-intermediate"}`}>{ex.difficulty}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="animate-fade-up delay-5 flex items-center justify-center gap-3">
            <Link href="/" className="btn-secondary inline-block no-underline">Back to Dashboard</Link>
            {allDone && (
              <button onClick={() => { resetProgress(); window.location.href = "/" }} className="btn-primary">
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
