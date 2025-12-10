import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, chatWithTiGuy } from '@/lib/ai/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { messages, useTiGuy = true } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    let response: string;

    if (useTiGuy && messages.length > 0) {
      // Use Ti-Guy Artiste personality
      const lastMessage = messages[messages.length - 1];
      const history = messages.slice(0, -1);
      response = await chatWithTiGuy(lastMessage.content, history);
    } else {
      // Standard chat
      response = await generateChatResponse(messages);
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
