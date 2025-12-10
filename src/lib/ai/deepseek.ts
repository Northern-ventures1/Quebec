/**
 * DeepSeek AI Integration
 * Cost-effective alternative for chat completions and embeddings
 */

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

if (!process.env.VITE_DEEPSEEK_API_KEY) {
  throw new Error('Missing env variable: VITE_DEEPSEEK_API_KEY');
}

const DEEPSEEK_API_KEY = process.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

export async function generateChatResponse(
  messages: Message[],
  options?: {
    temperature?: number;
    max_tokens?: number;
    model?: 'deepseek-chat' | 'deepseek-coder';
  }
): Promise<string> {
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options?.model || 'deepseek-chat',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.max_tokens || 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  // DeepSeek doesn't have a native embeddings endpoint
  // We'll use a simple hash-based embedding for now
  // In production, consider using a dedicated embedding service
  console.warn('Using basic embeddings. Consider integrating a dedicated embedding service.');
  
  // Simple hash-based embedding (for demonstration)
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Generate a 384-dimensional vector (compatible with many embedding models)
  const embedding = new Array(384).fill(0).map((_, i) => {
    return Math.sin(hash * (i + 1)) * Math.cos(hash / (i + 1));
  });
  
  return embedding;
}

export async function moderateContent(text: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
}> {
  // Basic content moderation using keyword matching
  const blockedWords = [
    'spam', 'scam', 'explicit', // Add more as needed
  ];
  
  const lowerText = text.toLowerCase();
  const flagged = blockedWords.some(word => lowerText.includes(word));
  
  return {
    flagged,
    categories: {
      spam: lowerText.includes('spam'),
      hate: false,
      violence: false,
      sexual: false,
    },
  };
}

/**
 * Ti-Guy Artiste - Quebec's AI Assistant
 * Responds in casual Joual when appropriate
 */
export async function chatWithTiGuy(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> {
  const systemPrompt = `You are Ti-Guy Artiste, Quebec's witty AI assistant. 
You're knowledgeable about Quebec culture, history, and lifestyle.
Respond in a friendly, casual tone. You can use Quebec French expressions when appropriate.
You help users with social media content, marketplace questions, and general Quebec topics.`;

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  return generateChatResponse(messages, {
    temperature: 0.8,
    max_tokens: 500,
  });
}
