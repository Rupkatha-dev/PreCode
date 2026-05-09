import type { Message } from "@/lib/types"

interface SpecBoxProps {
  spec: string
  onSpecChange: (value: string) => void
  onAskAI: () => void
  messages: Message[]
  isLoading: boolean
}

export default function SpecBox({ spec, onSpecChange, onAskAI, messages, isLoading }: SpecBoxProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Write your spec: describe what the function should do, its inputs, outputs, and edge cases.
        </label>
        <textarea
          value={spec}
          onChange={(e) => onSpecChange(e.target.value)}
          rows={6}
          placeholder="e.g. The function takes a string and returns true if it reads the same forwards and backwards..."
          className="w-full bg-black border border-neutral-800 rounded-sm p-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white resize-none transition-colors"
        />
      </div>
      <button
        onClick={onAskAI}
        disabled={isLoading || !spec.trim()}
        className="px-5 py-2 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm font-medium transition-colors"
      >
        {isLoading ? "Thinking..." : "Ask AI"}
      </button>

      {messages.length > 0 && (
        <div className="space-y-3 pt-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-sm text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-neutral-800 text-white"
                    : "bg-transparent border border-neutral-800 text-neutral-300"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
