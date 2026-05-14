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
    <main className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <div className="relative flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          {/* Animated checkmark */}
          {mounted && allDone && (
            <div className="mb-8 animate-check-pop">
              <div className="w-24 h-24 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          <div className="animate-fade-up delay-1">
            <h1 className="font-serif text-5xl sm:text-6xl text-stone-900 mb-4">
              {allDone ? (
                <>Course <span className="italic text-stone-400">Complete!</span></>
              ) : (
                "Course Progress"
              )}
            </h1>
            <p className="text-stone-500 text-base mb-10 leading-relaxed max-w-md mx-auto">
              {allDone
                ? "You have completed all exercises. You practiced the think-first approach across strings, arrays, conditionals, and recursion."
                : `You have completed ${completedCount} of ${EXERCISES.length} exercises. Keep going!`}
            </p>
          </div>

          {/* Stats cards */}
          <div className="animate-fade-up delay-3 grid grid-cols-3 gap-3 mb-10">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-stone-900">{completedCount}</div>
              <div className="text-xs text-stone-500 mt-1">Exercises</div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-stone-900">{completedCount * 3}</div>
              <div className="text-xs text-stone-500 mt-1">Phases</div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-stone-900">{completedCount}</div>
              <div className="text-xs text-stone-500 mt-1">Reflections</div>
            </div>
          </div>

          {/* Exercise checklist */}
          <div className="animate-fade-up delay-4 bg-white border border-stone-200 rounded-2xl p-5 mb-10 text-left shadow-sm">
            <h3 className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-4">Exercises</h3>
            <div className="space-y-3">
              {EXERCISES.map((ex) => {
                const done = completed.includes(ex.id)
                return (
                  <div key={ex.id} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-50 border border-green-200" : "bg-stone-100 border border-stone-200"}`}>
                      {done && <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm ${done ? "text-stone-900" : "text-stone-400"}`}>{ex.title}</span>
                    <span className={`badge ml-auto ${done ? "badge-beginner" : "badge-concept"}`}>{done ? "completed" : "pending"}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="animate-fade-up delay-5 flex items-center justify-center gap-3">
            <Link href="/" className="inline-flex items-center justify-center bg-white border border-stone-200 text-stone-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-50 transition-all no-underline">Back to Dashboard</Link>
            {allDone && (
              <button onClick={() => { resetProgress(); window.location.href = "/" }} className="inline-flex items-center justify-center bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-stone-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-stone-900/10">
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
