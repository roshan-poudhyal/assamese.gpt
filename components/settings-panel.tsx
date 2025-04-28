"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"

interface SettingsPanelProps {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [showSentiment, setShowSentiment] = useState(true)

  useEffect(() => {
    // Load settings from localStorage on mount
    const storedApiKey = localStorage.getItem("geminiApiKey")
    const storedDarkMode = localStorage.getItem("darkMode") === "true"
    const storedShowSentiment = localStorage.getItem("showSentiment") !== "false"

    if (storedApiKey) setApiKey(storedApiKey)
    if (storedDarkMode !== null) setDarkMode(storedDarkMode)
    if (storedShowSentiment !== null) setShowSentiment(storedShowSentiment)

    // Apply dark mode on initial load
    if (storedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleSaveSettings = () => {
    // Save settings to local storage or context
    localStorage.setItem("geminiApiKey", apiKey)
    localStorage.setItem("darkMode", String(darkMode))
    localStorage.setItem("showSentiment", String(showSentiment))

    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    onClose()
  }

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Google Gemini API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Your API key is stored locally and never sent to our servers.</p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-sentiment">Show Sentiment Analysis</Label>
          <Switch id="show-sentiment" checked={showSentiment} onCheckedChange={setShowSentiment} />
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  )
}

