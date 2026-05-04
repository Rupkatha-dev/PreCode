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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Write your spec — describe what the function should do, its inputs, outputs, and edge cases.
        </label>
        <textarea
          value={spec}
          onChange={(e) => onSpecChange(e.target.value)}
          rows={6}
          placeholder="e.g. The function takes a string and returns true if it reads the same forwards and backwards..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>
      <button
        onClick={onAskAI}
        disabled={isLoading || !spec.trim()}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
      >
        {isLoading ? "Thinking…" : "Ask AI"}
      </button>

      {messages.length > 0 && (
        <div className="space-y-3 pt-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-700 text-gray-100"
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
