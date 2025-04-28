import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface MessageItemProps {
  message: Message
  language: "english" | "assamese"
  onDelete?: (id: string) => void
}

interface MessagePart {
  type: 'text' | 'code' | 'list'
  content: string | TextPart[] | string[]
}

interface TextPart {
  type: 'normal' | 'bold' | 'italic'
  content: string
}

export default function MessageItem({ message, language, onDelete }: MessageItemProps) {
  const isUser = message.role === "user"

  const getSentimentLabel = () => {
    if (!message.sentiment) return null

    if (language === "english") {
      return message.sentiment.charAt(0).toUpperCase() + message.sentiment.slice(1)
    } else {
      switch (message.sentiment) {
        case "positive":
          return "ইতিবাচক"
        case "negative":
          return "নেতিবাচক"
        case "neutral":
          return "নিৰপেক্ষ"
        default:
          return message.sentiment
      }
    }
  }

  const getSentimentColor = () => {
    if (!message.sentiment) return "bg-secondary"

    switch (message.sentiment) {
      case "positive":
        return "bg-green-500 hover:bg-green-600"
      case "negative":
        return "bg-red-500 hover:bg-red-600"
      case "neutral":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-secondary"
    }
  }

  const getTimeLabel = () => {
    try {
      return formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
    } catch (e) {
      return ""
    }
  }

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message.content);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = message.content;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          textArea.remove();
        } catch (error) {
          console.error("Copy failed", error);
          throw error;
        }
      }
      toast.success(language === "english" ? "Copied to clipboard!" : "ক্লিপব'ৰ্ডলৈ কপি কৰা হ'ল!");
    } catch (error) {
      console.error("Copy failed", error);
      toast.error(language === "english" ? "Failed to copy to clipboard" : "ক্লিপব'ৰ্ডলৈ কপি কৰিব পৰা নগ'ল");
    }
  }

  const parseMessageContent = (content: string): MessagePart[] => {
    // Parse code blocks first
    const codeBlockRegex = /```(?:[a-z]+\n)?([\s\S]*?)```/g;
    // Parse numbered lists
    const listRegex = /^\d+\.\s+.+$/gm;
    let parts: MessagePart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textPart = content.slice(lastIndex, match.index);
        parts.push({ type: 'text', content: parseBoldText(textPart) });
      }
      // Add code block
      parts.push({ type: 'code', content: match[1].trim() });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textPart = content.slice(lastIndex);
      parts.push({ type: 'text', content: parseBoldText(textPart) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: parseBoldText(content) }];
  };

  const parseBoldText = (text: string): TextPart[] => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const italicRegex = /_([^_]+)_/g;
    let parts: TextPart[] = [];
    let lastIndex = 0;
    let match;

    while (true) {
      const boldMatch = boldRegex.exec(text);
      const italicMatch = italicRegex.exec(text);
      
      if (!boldMatch && !italicMatch) break;
      
      if (boldMatch && (!italicMatch || boldMatch.index < italicMatch.index)) {
        if (boldMatch.index > lastIndex) {
          parts.push({ type: 'normal', content: text.slice(lastIndex, boldMatch.index) });
        }
        parts.push({ type: 'bold', content: boldMatch[1] });
        lastIndex = boldMatch.index + boldMatch[0].length;
      } else {
        if (italicMatch.index > lastIndex) {
          parts.push({ type: 'normal', content: text.slice(lastIndex, italicMatch.index) });
        }
        parts.push({ type: 'italic', content: italicMatch[1] });
        lastIndex = italicMatch.index + italicMatch[0].length;
      }
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'normal', content: text.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'normal', content: text }];
  };

  const isCode = message.content.includes("```");

  return (
    <div className={cn("flex gap-3 items-start", isUser && "flex-row-reverse")}>
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-secondary")}>
        <AvatarFallback>{isUser ? "U" : "A"}</AvatarFallback>
        {!isUser && <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Assistant" />}
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%]", isUser && "items-end")}>
        {isCode ? (
          <fieldset className="border rounded-lg p-4 relative">
            <legend className="px-2 text-sm font-medium">{language === "english" ? "Code Answer" : "ক'ড উত্তৰ"}</legend>
            <div className="absolute right-2 top-2 flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleCopyCode} title={language === "english" ? "Copy code" : "ক'ড কপি কৰক"}>
                <Copy className="h-4 w-4" />
              </Button>
              {onDelete && (
                <Button variant="ghost" size="icon" onClick={() => onDelete(message.id)} title={language === "english" ? "Delete message" : "বাৰ্তা মচি পেলাওক"}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="whitespace-pre-wrap overflow-x-auto">
              {parseMessageContent(message.content).map((part, index) => {
                if (part.type === 'code') {
                  return <pre key={index} className="bg-muted p-2 rounded">{part.content}</pre>;
                }
                return (
                  <span key={index}>
                    {Array.isArray(part.content) && part.content.map((textPart, textIndex) => (
                      <span 
                        key={textIndex} 
                        className={cn(
                          textPart.type === 'bold' && 'font-bold',
                          textPart.type === 'italic' && 'italic'
                        )}
                      >
                        {textPart.content}
                      </span>
                    ))}
                  </span>
                );
              })}
            </div>
          </fieldset>
        ) : (
          <div className={cn("rounded-lg px-4 py-2 text-sm relative group", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
            <div className="whitespace-pre-wrap">
              {parseMessageContent(message.content).map((part, index) => (
                <span key={index}>
                  {Array.isArray(part.content) && part.content.map((textPart, textIndex) => (
                    <span key={textIndex} className={textPart.type === 'bold' ? 'font-bold' : ''}>
                      {textPart.content}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(message.id)}
                title={language === "english" ? "Delete message" : "বাৰ্তা মচি পেলাওক"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {message.sentiment && !isUser && (
            <Badge variant="secondary" className={getSentimentColor()}>
              {getSentimentLabel()}
            </Badge>
          )}
          <span>{getTimeLabel()}</span>
        </div>
      </div>
    </div>
  )
}

