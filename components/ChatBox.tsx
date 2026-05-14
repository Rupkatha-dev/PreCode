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
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">AI Tutor</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-stone-400 text-sm text-center mt-8 leading-relaxed">
            Syntax questions get direct answers.<br />
            Debug questions get guiding questions.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
              m.role === "user" ? "bg-stone-900 text-white rounded-tr-none" : "bg-stone-50 text-stone-700 border border-stone-100 rounded-tl-none"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-50 border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 w-fit">
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-stone-100 bg-stone-50/50 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1 bg-white border border-stone-200 rounded-full px-4 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 disabled:opacity-50 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  )
}
