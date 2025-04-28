"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AssameseKeyboardProps {
  onKeyPress: (char: string) => void
}

export default function AssameseKeyboard({ onKeyPress }: AssameseKeyboardProps) {
  const [shift, setShift] = useState(false)

  const vowels = ["অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "এ", "ঐ", "ও", "ঔ"]

  const consonants = [
    "ক",
    "খ",
    "গ",
    "ঘ",
    "ঙ",
    "চ",
    "ছ",
    "জ",
    "ঝ",
    "ঞ",
    "ট",
    "ঠ",
    "ড",
    "ঢ",
    "ণ",
    "ত",
    "থ",
    "দ",
    "ধ",
    "ন",
    "প",
    "ফ",
    "ব",
    "ভ",
    "ম",
    "য",
    "ৰ",
    "ল",
    "ৱ",
    "শ",
    "ষ",
    "স",
    "হ",
    "ক্ষ",
    "ড়",
    "ঢ়",
    "য়",
    "ৎ",
  ]

  const diacritics = ["া", "ি", "ী", "ু", "ূ", "ৃ", "ে", "ৈ", "ো", "ৌ", "্", "ং", "ঃ", "ঁ"]

  const numbers = ["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "০"]

  const punctuation = ["।", "৷", ",", ".", "?", "!", '"', "'", ":", ";", "(", ")", "-", "+", "=", "/", "\\"]

  const handleKeyPress = (char: string) => {
    onKeyPress(char)
    if (shift) setShift(false)
  }

  const handleSpace = () => {
    onKeyPress(" ")
  }

  const handleBackspace = () => {
    onKeyPress("\b")
  }

  const renderKeys = (keys: string[]) => {
    return (
      <div className="grid grid-cols-10 gap-1">
        {keys.map((key, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-8 text-sm font-normal"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="p-2 bg-background border rounded-md">
      <Tabs defaultValue="consonants">
        <TabsList className="grid grid-cols-5 mb-2">
          <TabsTrigger value="consonants">ব্যঞ্জনবৰ্ণ</TabsTrigger>
          <TabsTrigger value="vowels">স্বৰবৰ্ণ</TabsTrigger>
          <TabsTrigger value="diacritics">মাত্ৰা</TabsTrigger>
          <TabsTrigger value="numbers">সংখ্যা</TabsTrigger>
          <TabsTrigger value="punctuation">যতিচিহ্ন</TabsTrigger>
        </TabsList>

        <TabsContent value="consonants" className="mt-0">
          {renderKeys(consonants)}
        </TabsContent>

        <TabsContent value="vowels" className="mt-0">
          {renderKeys(vowels)}
        </TabsContent>

        <TabsContent value="diacritics" className="mt-0">
          {renderKeys(diacritics)}
        </TabsContent>

        <TabsContent value="numbers" className="mt-0">
          {renderKeys(numbers)}
        </TabsContent>

        <TabsContent value="punctuation" className="mt-0">
          {renderKeys(punctuation)}
        </TabsContent>
      </Tabs>

      <div className="flex gap-1 mt-2">
        <Button variant="outline" className="flex-1" onClick={handleSpace}>
          Space
        </Button>
        <Button variant="outline" onClick={handleBackspace}>
          Backspace
        </Button>
      </div>
    </div>
  )
}

