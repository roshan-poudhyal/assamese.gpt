export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sentiment?: "positive" | "negative" | "neutral"
  timestamp: string
}

export interface ChatResponse {
  content: string
  sentiment: "positive" | "negative" | "neutral"
}

