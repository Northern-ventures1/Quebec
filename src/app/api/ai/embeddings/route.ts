import { NextRequest, NextResponse } from 'next/server';
import { generateEmbeddings } from '@/lib/ai/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const embedding = await generateEmbeddings(text);

    return NextResponse.json({
      embedding,
      dimensions: embedding.length,
    });
  } catch (error: any) {
    console.error('Embeddings API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate embeddings' },
      { status: 500 }
    );
  }
}
