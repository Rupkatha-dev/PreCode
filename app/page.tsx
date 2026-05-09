"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import SpecBox from "@/components/SpecBox"
import ChatBox from "@/components/ChatBox"
import type { Phase, Message, AIRequestBody, AIResponse } from "@/lib/types"

const CodeBox = dynamic(() => import("@/components/CodeBox"), { ssr: false })

const EXERCISE = {
  title: "Palindrome Checker",
  prompt: "Write a function to check if a string is a palindrome.",
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("spec")
  const [spec, setSpec] = useState("")
  const [clarifyMessages, setClarifyMessages] = useState<Message[]>([])
  const [code, setCode] = useState("")
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [aiReflection, setAiReflection] = useState("")
  const [studentReflection, setStudentReflection] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function callAI(body: AIRequestBody): Promise<AIResponse> {
    setIsLoading(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      return await res.json()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAskAI() {
    const data = await callAI({
      type: "clarify",
      payload: { spec, history: clarifyMessages },
    })
    const newMessages: Message[] = [
      ...clarifyMessages,
      { role: "user", content: spec },
      { role: "assistant", content: data.message },
    ]
    setClarifyMessages(newMessages)
    if (data.specReady) {
      setPhase("coding")
    }
  }

  async function handleChatSend(message: string) {
    const data = await callAI({
      type: "chat",
      payload: { code, message, history: chatMessages },
    })
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: message },
      { role: "assistant", content: data.message },
    ])
  }

  async function handleSubmit() {
    const data = await callAI({
      type: "submit",
      payload: { spec, code },
    })
    setAiReflection(data.message)
    setPhase("reflection")
  }

  async function handleReflectionSubmit() {
    if (!studentReflection.trim()) return
    await callAI({
      type: "save",
      payload: { spec, code, reflection: studentReflection, aiReflection },
    })
    setPhase("done")
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Exercise</span>
            <h1 className="text-xl font-bold mt-0.5">{EXERCISE.title}</h1>
            <p className="text-neutral-500 text-sm mt-1">{EXERCISE.prompt}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {(["spec", "coding", "reflection", "done"] as Phase[]).map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                {i > 0 && <div className="w-6 h-px bg-neutral-800" />}
                <span
                  className={`px-2 py-1 rounded-sm text-xs font-medium capitalize ${
                    phase === p
                      ? "bg-white text-black"
                      : i < (["spec", "coding", "reflection", "done"] as Phase[]).indexOf(phase)
                      ? "text-neutral-400"
                      : "text-neutral-600"
                  }`}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {phase === "spec" && (
          <SpecBox
            spec={spec}
            onSpecChange={setSpec}
            onAskAI={handleAskAI}
            messages={clarifyMessages}
            isLoading={isLoading}
          />
        )}

        {phase === "coding" && (
          <div className="space-y-4">
            <div className="flex gap-4" style={{ height: "65vh" }}>
              <div className="flex-1">
                <CodeBox code={code} onCodeChange={setCode} isEnabled={true} />
              </div>
              <div className="w-80 flex-shrink-0">
                <ChatBox messages={chatMessages} onSend={handleChatSend} isLoading={isLoading} />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !code.trim()}
                className="px-6 py-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm font-medium transition-colors"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}

        {phase === "reflection" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">AI Feedback</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4 text-neutral-200 whitespace-pre-wrap">
                {aiReflection}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Your reflection: answer the question above.
              </label>
              <textarea
                value={studentReflection}
                onChange={(e) => setStudentReflection(e.target.value)}
                rows={5}
                placeholder="Write your reflection here..."
                className="w-full bg-black border border-neutral-800 rounded-sm p-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white resize-none transition-colors"
              />
            </div>
            <button
              onClick={handleReflectionSubmit}
              disabled={isLoading || !studentReflection.trim()}
              className="px-6 py-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm font-medium transition-colors"
            >
              {isLoading ? "Saving..." : "Complete"}
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-5xl mb-4 text-white">✓</div>
            <h2 className="text-2xl font-bold mb-2">Flow Complete</h2>
            <p className="text-neutral-500">Your session has been saved. Good work thinking before coding.</p>
          </div>
        )}
      </div>
    </main>
  )
}
