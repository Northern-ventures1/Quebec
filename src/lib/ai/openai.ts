import { OpenAI } from 'openai';

if (!process.env.VITE_OPENAI_API_KEY) {
  throw new Error('Missing env variable: VITE_OPENAI_API_KEY');
}

export const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
) {
  return openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
    max_tokens: 500,
  });
}

export async function generateEmbeddings(text: string) {
  const result = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return result.data[0]?.embedding || [];
}

export async function moderateContent(text: string) {
  return openai.moderations.create({ input: text });
}
