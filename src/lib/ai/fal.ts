/**
 * FAL AI Integration for Image Generation
 * Fast and affordable AI image generation
 */

import * as fal from '@fal-ai/serverless-client';

if (!process.env.VITE_FAL_API_KEY) {
  throw new Error('Missing env variable: VITE_FAL_API_KEY');
}

fal.config({
  credentials: process.env.VITE_FAL_API_KEY,
});

export interface ImageGenerationOptions {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'anime' | 'sketch' | 'quebec-inspired';
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  content_type: string;
}

/**
 * Generate an image using FAL AI
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage> {
  const { prompt, style = 'realistic', width = 1024, height = 1024 } = options;

  // Enhance prompt based on style
  let enhancedPrompt = prompt;
  if (style === 'quebec-inspired') {
    enhancedPrompt = `${prompt}, Quebec-inspired, Canadian aesthetic, fleur-de-lis motif`;
  }

  try {
    const result = await fal.subscribe('fal-ai/flux-pro', {
      input: {
        prompt: enhancedPrompt,
        image_size: `${width}x${height}`,
        num_inference_steps: options.num_inference_steps || 28,
        guidance_scale: options.guidance_scale || 3.5,
      },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Image generation in progress...');
        }
      },
    });

    const imageData = result.data as any;
    return {
      url: imageData.images[0].url,
      width: imageData.images[0].width || width,
      height: imageData.images[0].height || height,
      content_type: imageData.images[0].content_type || 'image/jpeg',
    };
  } catch (error) {
    console.error('FAL AI generation error:', error);
    throw new Error('Failed to generate image');
  }
}

/**
 * Ti-Guy Studio - AI-powered content creator
 * Generates assets for content creators
 */
export async function generateStudioAsset(
  prompt: string,
  style: ImageGenerationOptions['style'] = 'quebec-inspired'
): Promise<GeneratedImage> {
  const studioPrompt = `${prompt}, high quality, professional, social media ready, vibrant colors`;

  return generateImage({
    prompt: studioPrompt,
    style,
    width: 1024,
    height: 1024,
    num_inference_steps: 30,
  });
}

/**
 * Generate a profile banner
 */
export async function generateProfileBanner(
  theme: string
): Promise<GeneratedImage> {
  const prompt = `${theme} banner design, Quebec-inspired, professional, clean, modern aesthetic`;

  return generateImage({
    prompt,
    style: 'quebec-inspired',
    width: 1500,
    height: 500,
  });
}

/**
 * Generate a marketplace product image
 */
export async function generateProductImage(
  productDescription: string
): Promise<GeneratedImage> {
  const prompt = `${productDescription}, product photography, professional lighting, white background, high resolution`;

  return generateImage({
    prompt,
    style: 'realistic',
    width: 1024,
    height: 1024,
  });
}
