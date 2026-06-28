import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

if (!process.env.GEMINI_API_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('Missing GEMINI_API_KEY environment variable.');
}

// We use gemini-1.5-flash by default for fast, cost-effective responses.
// We can use gemini-1.5-pro for more complex evaluation node logic if needed.
export const geminiModel = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  apiKey: process.env.GEMINI_API_KEY || 'mock-api-key-so-builds-dont-fail-without-env',
  temperature: 0.7,
});

export const geminiProModel = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro',
  apiKey: process.env.GEMINI_API_KEY || 'mock-api-key-so-builds-dont-fail-without-env',
  temperature: 0.2,
});
