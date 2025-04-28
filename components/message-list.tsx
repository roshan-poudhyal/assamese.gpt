import type { Message } from "@/lib/types"
import MessageItem from "@/components/message-item"

interface MessageListProps {
  messages: Message[]
  language: "english" | "assamese"
  onDelete?: (id: string) => void
}

export default function MessageList({ messages, language, onDelete }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} language={language} onDelete={onDelete} />
      ))}
    </div>
  )
}

