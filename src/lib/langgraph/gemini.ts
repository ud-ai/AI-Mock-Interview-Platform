import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Missing GEMINI_API_KEY environment variable. Please set it in your Vercel project settings.');
  }
  return key;
}

// We use gemini-1.5-flash by default for fast, cost-effective responses.
// We can use gemini-1.5-pro for more complex evaluation node logic if needed.
export function getGeminiModel() {
  return new ChatGoogleGenerativeAI({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    apiKey: getApiKey(),
    temperature: 0.7,
  });
}

export function getGeminiProModel() {
  return new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-pro',
    apiKey: getApiKey(),
    temperature: 0.2,
  });
}

// Backwards-compatible lazy singletons
export const geminiModel = { invoke: (...args: any[]) => getGeminiModel().invoke(...args) };
export const geminiProModel = { invoke: (...args: any[]) => getGeminiProModel().invoke(...args) };
