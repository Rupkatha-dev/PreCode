export type DifficultyLevel = "beginner" | "intermediate" | "expert"
export type Phase = "level_select" | "spec" | "coding" | "reflection" | "done"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ClarifyPayload {
  prompt: string
  spec: string
  history: Message[]
}

export interface ChatPayload {
  prompt: string
  code: string
  message: string
  history: Message[]
}

export interface SubmitPayload {
  prompt: string
  spec: string
  code: string
}

export interface SavePayload {
  spec: string
  code: string
  reflection: string
  aiReflection: string
}

export type AIRequestBody =
  | { type: "clarify"; payload: ClarifyPayload }
  | { type: "chat"; payload: ChatPayload }
  | { type: "submit"; payload: SubmitPayload }
  | { type: "save"; payload: SavePayload }

export interface AIResponse {
  message: string
  specReady?: boolean
  rating?: number
  ok?: boolean
}
