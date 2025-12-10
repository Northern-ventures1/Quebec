import { NextRequest, NextResponse } from 'next/server';
import { moderateContent } from '@/lib/ai/deepseek';
import { supabaseAdmin } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  try {
    const { text, userId, contentType = 'post' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const moderation = await moderateContent(text);

    // Log moderation if flagged
    if (moderation.flagged && userId) {
      await supabaseAdmin.from('moderation_logs').insert({
        user_id: userId,
        content_type: contentType,
        content_text: text.substring(0, 500), // Store first 500 chars
        flagged: true,
        categories: moderation.categories,
      });
    }

    return NextResponse.json({
      approved: !moderation.flagged,
      flagged: moderation.flagged,
      categories: moderation.categories,
    });
  } catch (error: any) {
    console.error('Moderation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to moderate content' },
      { status: 500 }
    );
  }
}
