export type Phase = "spec" | "coding" | "reflection" | "done"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ClarifyPayload {
  spec: string
  history: Message[]
}

export interface ChatPayload {
  code: string
  message: string
  history: Message[]
}

export interface SubmitPayload {
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
  ok?: boolean
}
