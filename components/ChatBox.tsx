"use client"

import { useState, useRef, useEffect } from "react"
import type { Message } from "@/lib/types"

interface ChatBoxProps {
  messages: Message[]
  onSend: (message: string) => void
  isLoading: boolean
}

export default function ChatBox({ messages, onSend, isLoading }: ChatBoxProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSend() {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput("")
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700">
      <div className="px-3 py-2 border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Ask a question
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">
            Syntax questions get direct answers.<br />
            Debug questions get guiding questions.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-blue-700 text-white" : "bg-gray-700 text-gray-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-400 px-3 py-2 rounded-lg text-sm">…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-2 border-t border-gray-700 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question…"
          disabled={isLoading}
          className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
