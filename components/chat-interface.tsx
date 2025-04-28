"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Mic, Settings } from "lucide-react"
import MessageList from "@/components/message-list"
import AssameseKeyboard from "@/components/assamese-keyboard"
import SettingsPanel from "@/components/settings-panel"
import { sendMessage } from "@/lib/api"
import type { Message } from "@/lib/types"

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "নমস্কাৰ! মই আপোনাৰ অসমীয়া সহায়ক। আপুনি মোক ইংৰাজী বা অসমীয়াত প্ৰশ্ন সুধিব পাৰে।\n\nHello! I am your Assamese assistant. You can ask me questions in English or Assamese.",
      sentiment: "positive",
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<"english" | "assamese">("english")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedMessages = localStorage.getItem("chatMessages")
        if (storedMessages && messages.length === 1) {
          const parsedMessages = JSON.parse(storedMessages)
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            setMessages(parsedMessages)
          }
        }
      } catch (error) {
        console.error("Error loading messages from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        localStorage.setItem("chatMessages", JSON.stringify(messages))
      } catch (error) {
        console.error("Error saving messages to localStorage:", error)
      }
    }
  }, [messages])

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get API key from local storage if available
      const storedApiKey = localStorage.getItem("geminiApiKey")

      const response = await sendMessage(input, language, storedApiKey || undefined)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        sentiment: response.sentiment,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          language === "english"
            ? "Sorry, I encountered an error. Please try again."
            : "দুঃখিত, মই এটা ত্ৰুটি পালোঁ। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",
        sentiment: "negative",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const insertCharacter = (char: string) => {
    setInput((prev) => prev + char)
    inputRef.current?.focus()
  }

  const toggleLanguage = (value: string) => {
    setLanguage(value as "english" | "assamese")
    setShowKeyboard(value === "assamese")
  }

  return (
    <div className="flex flex-col w-full max-w-4xl h-screen p-4">
      <Card className="flex flex-col h-full overflow-hidden border-none bg-background shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">
            {language === "english" ? "Assamese Chat Assistant" : "অসমীয়া কথোপকথন সহায়ক"}
          </h1>
          <div className="flex items-center gap-2">
            <Tabs defaultValue={language} onValueChange={toggleLanguage}>
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="assamese">অসমীয়া</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <MessageList messages={messages} language={language} />
          <div ref={messagesEndRef} />
        </div>

        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

        {showKeyboard && (
          <div className="p-2 border-t">
            <AssameseKeyboard onKeyPress={insertCharacter} />
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              placeholder={language === "english" ? "Type a message..." : "এটা বাৰ্তা লিখক..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={showKeyboard ? "bg-muted" : ""}
            >
              <span className="font-bold">অ</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

