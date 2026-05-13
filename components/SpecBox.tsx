import type { Message } from "@/lib/types"

interface SpecBoxProps {
  spec: string
  onSpecChange: (value: string) => void
  onAskAI: () => void
  messages: Message[]
  isLoading: boolean
  rating?: number | null
}

export default function SpecBox({ spec, onSpecChange, onAskAI, messages, isLoading, rating }: SpecBoxProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-600">
            Write your spec: describe what the function should do, its inputs, outputs, and edge cases.
          </label>
          {rating !== undefined && rating !== null && (
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm" title={`AI Rating: ${rating}/5`}>
              <span className="text-xs font-bold text-gray-400 mr-1">Rating</span>
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
        <textarea
          value={spec}
          onChange={(e) => onSpecChange(e.target.value)}
          rows={6}
          placeholder="e.g. The function takes a string and returns true if it reads the same forwards and backwards..."
          className="w-full bg-white border border-gray-200 rounded-sm p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none transition-colors shadow-sm"
        />
      </div>
      <button
        onClick={onAskAI}
        disabled={isLoading || !spec.trim()}
        className="px-5 py-2 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm font-medium transition-colors shadow-sm"
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
                    ? "bg-orange-100 text-orange-900 border border-orange-200"
                    : "bg-white border border-gray-200 text-gray-700 shadow-sm"
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
