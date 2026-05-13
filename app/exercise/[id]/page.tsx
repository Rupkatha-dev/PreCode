"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"
import SpecBox from "@/components/SpecBox"
import ChatBox from "@/components/ChatBox"
import { getExercise, EXERCISES } from "@/lib/exercises"
import type { Phase, Message, AIRequestBody, AIResponse, DifficultyLevel } from "@/lib/types"

const CodeBox = dynamic(() => import("@/components/CodeBox"), { ssr: false })

function getProgress(): number[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("precode-progress")
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function markComplete(id: number) {
  const progress = getProgress()
  if (!progress.includes(id)) {
    progress.push(id)
    localStorage.setItem("precode-progress", JSON.stringify(progress))
  }
}

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const exerciseId = Number(params.id)
  const exercise = getExercise(exerciseId)

  const [phase, setPhase] = useState<Phase>("level_select")
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null)
  const [spec, setSpec] = useState("")
  const [specRating, setSpecRating] = useState<number | null>(null)
  const [clarifyMessages, setClarifyMessages] = useState<Message[]>([])
  const [code, setCode] = useState("")
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [aiReflection, setAiReflection] = useState("")
  const [studentReflection, setStudentReflection] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!exercise) router.push("/")
  }, [exercise, router])

  if (!exercise) {
    return <main className="min-h-screen bg-orange-50 text-gray-900 flex items-center justify-center"><p className="text-gray-500">Loading...</p></main>
  }

  const nextExercise = EXERCISES.find((e) => e.id === exerciseId + 1)
  const phaseList: Phase[] = ["level_select", "spec", "coding", "reflection", "done"]
  const currentPhaseIndex = phaseList.indexOf(phase)

  async function callAI(body: AIRequestBody): Promise<AIResponse> {
    setIsLoading(true)
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      return await res.json()
    } finally { setIsLoading(false) }
  }

  async function handleAskAI() {
    const data = await callAI({ type: "clarify", payload: { prompt: exercise.levels[selectedLevel!].prompt, spec, history: clarifyMessages } })
    if (data.rating) setSpecRating(data.rating)
    if (data.message) {
      setClarifyMessages(prev => [...prev, { role: "user", content: spec }, { role: "assistant", content: data.message }])
    }
    if (data.specReady) setPhase("coding")
  }

  async function handleChatSend(message: string) {
    const data = await callAI({ type: "chat", payload: { prompt: exercise.levels[selectedLevel!].prompt, code, message, history: chatMessages } })
    setChatMessages(prev => [...prev, { role: "user", content: message }, { role: "assistant", content: data.message }])
  }

  async function handleSubmit() {
    const data = await callAI({ type: "submit", payload: { prompt: exercise.levels[selectedLevel!].prompt, spec, code } })
    setAiReflection(data.message)
    setPhase("reflection")
  }

  async function handleReflectionSubmit() {
    if (!studentReflection.trim()) return
    await callAI({ type: "save", payload: { spec, code, reflection: studentReflection, aiReflection } })
    markComplete(exerciseId)
    setPhase("done")
  }

  return (
    <main className="min-h-screen bg-orange-50 text-gray-900">
      {/* Top bar */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors" title="Back to course">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">{String(exerciseId).padStart(2, "0")}</span>
                <h1 className="text-base font-semibold">{exercise.title}</h1>
                {selectedLevel && (
                  <span className={`badge ${selectedLevel === "beginner" ? "badge-beginner" : "badge-intermediate"}`}>{selectedLevel}</span>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                {selectedLevel ? exercise.levels[selectedLevel].prompt : exercise.description}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {phaseList.map((p, i) => (
              <div key={p} className="flex items-center gap-1">
                {i > 0 && <div className="phase-connector" />}
                <span className={`phase-step ${phase === p ? "phase-step-active" : i < currentPhaseIndex ? "phase-step-done" : ""}`}>
                  {i < currentPhaseIndex && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
        {phase === "level_select" && (
          <div className="max-w-4xl mx-auto py-12 animate-fade-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-3">Select Difficulty</h2>
              <p className="text-gray-500">Choose a level to tailor the exercise prompt to your current skill.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["beginner", "intermediate", "expert"] as DifficultyLevel[]).map((level) => (
                <div 
                  key={level} 
                  className="glass-card p-6 cursor-pointer hover:border-orange-400 hover:-translate-y-1 transition-all group"
                  onClick={() => { setSelectedLevel(level); setPhase("spec"); }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${level === "beginner" ? "bg-green-100 text-green-600" : level === "intermediate" ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold capitalize mb-3 text-gray-900 group-hover:text-orange-600 transition-colors">{level}</h3>
                  <p className="text-sm text-gray-500 line-clamp-4">{exercise.levels[level].prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "spec" && (
          <div className="animate-fade-up">
            <div className="max-w-2xl mx-auto mb-6">
              <div className="glass-card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Hint</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{exercise.levels[selectedLevel!].starterHint}</p>
                </div>
              </div>
            </div>
            <SpecBox spec={spec} onSpecChange={setSpec} onAskAI={handleAskAI} messages={clarifyMessages} isLoading={isLoading} rating={specRating} />
          </div>
        )}

        {phase === "coding" && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex gap-4" style={{ height: "65vh" }}>
              <div className="flex-1"><CodeBox code={code} onCodeChange={setCode} isEnabled={true} /></div>
              <div className="w-80 flex-shrink-0"><ChatBox messages={chatMessages} onSend={handleChatSend} isLoading={isLoading} /></div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSubmit} disabled={isLoading || !code.trim()} className="btn-primary">{isLoading ? "Submitting..." : "Submit Code"}</button>
            </div>
          </div>
        )}

        {phase === "reflection" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
            <div className="glass-card p-6">
              <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4">AI Feedback</h2>
              <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{aiReflection}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Reflection</label>
              <textarea value={studentReflection} onChange={(e) => setStudentReflection(e.target.value)} rows={5} placeholder="Write your reflection here..." className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500/50 resize-none transition-all" />
            </div>
            <button onClick={handleReflectionSubmit} disabled={isLoading || !studentReflection.trim()} className="btn-primary">{isLoading ? "Saving..." : "Complete Exercise"}</button>
          </div>
        )}

        {phase === "done" && (
          <div className="max-w-lg mx-auto text-center py-16 animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6 animate-check-pop">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Exercise Complete</h2>
            <p className="text-gray-500 mb-8 text-sm">Great job thinking before coding. Your session has been saved.</p>
            <div className="flex items-center justify-center gap-3">
              {nextExercise ? (
                <>
                  <Link href="/" className="btn-secondary inline-block no-underline">Dashboard</Link>
                  <Link href={`/exercise/${nextExercise.id}`} className="btn-primary inline-block no-underline">Next: {nextExercise.title} &rarr;</Link>
                </>
              ) : (
                <>
                  <Link href="/" className="btn-secondary inline-block no-underline">Dashboard</Link>
                  <Link href="/complete" className="btn-primary inline-block no-underline">View Course Summary &rarr;</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
