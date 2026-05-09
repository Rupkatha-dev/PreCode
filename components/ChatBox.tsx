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
    <div className="flex flex-col h-full bg-black rounded-sm border border-neutral-800">
      <div className="px-3 py-2 border-b border-neutral-800 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
        Ask a question
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-neutral-600 text-sm text-center mt-4">
            Syntax questions get direct answers.<br />
            Debug questions get guiding questions.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-sm text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-neutral-800 text-white" : "bg-transparent text-neutral-300 border border-neutral-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="text-neutral-500 px-3 py-2 rounded-sm text-sm border border-neutral-800">...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-2 border-t border-neutral-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1 bg-black border border-neutral-800 rounded-sm px-2 py-1 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white disabled:opacity-50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-3 py-1 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
