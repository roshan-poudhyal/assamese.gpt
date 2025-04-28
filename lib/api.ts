"use server";

import type { ChatResponse } from "@/lib/types";

export async function sendMessage(
  message: string,
  language: "english" | "assamese",
  clientApiKey?: string,
): Promise<ChatResponse> {
  try {
    // Use API Key from environment variable or client input
    const apiKey = "AIzaSyA_2BVFOAv-cUdbSjLL_C4oIkH1QWmfCvI";
    if (!apiKey) {
      return {
        content: language === "english"
          ? "API key not found. Please add your Google Gemini API key in the settings panel."
          : "API কি পোৱা নাই। অনুগ্ৰহ কৰি আপোনাৰ Google Gemini API কি ছেটিংছত যোগ কৰক।",
        sentiment: "neutral",
      };
    }

    // Updated prompt to instruct response formatting
    const prompt = `
      You are an AI assistant that specializes in Assamese and English languages.
      The user message is: "${message}".
      Respond in ${language === "english" ? "English" : "Assamese"}.

      Analyze the sentiment of the user's message (positive, negative, or neutral).

      Provide the response in the exact JSON format:
      {
        "content": "Provide the detailed response, and include any code snippets using proper markdown with triple backticks and language labels.",
        "sentiment": "positive/negative/neutral"
      }
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    // Check for API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${response.statusText}`, errorText);
      return {
        content: "API error occurred. Please try again later.",
        sentiment: "negative",
      };
    }

    // Extract data
    const data = await response.json();

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected API response:", data);
      return {
        content: "Unexpected response from the API.",
        sentiment: "neutral",
      };
    }

    const text = data.candidates[0].content.parts[0].text;

    // Parse JSON response with code block handling
    try {
      // Clean and validate the text before parsing
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/) || [null, text];
      let jsonText = jsonMatch[1] || text;
      
      // Remove any leading/trailing whitespace and ensure we have valid JSON structure
      jsonText = jsonText.trim();
      if (!jsonText.startsWith('{')) {
        throw new Error('Invalid JSON structure');
      }
      
      // Attempt to parse the cleaned JSON
      const parsedResponse = JSON.parse(jsonText);

      return {
        content: parsedResponse.content,
        sentiment: parsedResponse.sentiment,
      };
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      return {
        content: text,
        sentiment: "neutral",
      };
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return {
      content: language === "english"
        ? "An error occurred. Please try again later."
        : "একটা ত্ৰুটি ঘটিছে। অনুগ্ৰহ কৰি পিছত পুনৰ চেষ্টা কৰক।",
      sentiment: "negative",
    };
  }
}
