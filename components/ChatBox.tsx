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
    <div className="flex flex-col h-full bg-white rounded-sm border border-gray-200 shadow-sm">
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
              className={`max-w-[85%] px-3 py-2 rounded-sm text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-orange-100 text-orange-900 border border-orange-200" : "bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="text-gray-500 px-3 py-2 rounded-sm text-sm border border-gray-200 bg-gray-50">...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-2 border-t border-gray-200 bg-gray-50 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1 bg-white border border-gray-200 rounded-sm px-2 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-3 py-1 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm text-sm font-medium transition-colors shadow-sm"
        >
          Send
        </button>
      </div>
    </div>
  )
}
