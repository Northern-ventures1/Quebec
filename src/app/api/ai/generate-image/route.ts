import { NextRequest, NextResponse } from 'next/server';
import { generateImage, generateStudioAsset, generateProfileBanner, generateProductImage } from '@/lib/ai/fal';
import { supabaseAdmin } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'general', style, userId } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'studio':
        result = await generateStudioAsset(prompt, style);
        break;
      case 'banner':
        result = await generateProfileBanner(prompt);
        break;
      case 'product':
        result = await generateProductImage(prompt);
        break;
      default:
        result = await generateImage({ prompt, style });
    }

    // Track AI usage if userId provided
    if (userId) {
      await supabaseAdmin.from('ai_usage_logs').insert({
        user_id: userId,
        type: 'image_generation',
        model: 'fal-ai/flux-pro',
        metadata: { prompt, style, type },
      });
    }

    return NextResponse.json({
      success: true,
      image: result,
    });
  } catch (error: any) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
