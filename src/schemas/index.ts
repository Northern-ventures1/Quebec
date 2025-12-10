/**
 * Zod Validation Schemas
 * Use these to validate all API request bodies
 */

import { z } from 'zod';

// ============================================
// User Schemas
// ============================================
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  display_name: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  banner_url: z.string().url().optional(),
});

// ============================================
// Post Schemas
// ============================================
export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  media_urls: z.array(z.string().url()).max(10, 'Maximum 10 media files').optional(),
  visibility: z.enum(['public', 'friends', 'private']).default('public'),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  visibility: z.enum(['public', 'friends', 'private']).optional(),
});

// ============================================
// Comment Schemas
// ============================================
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Comment too long'),
  media_urls: z.array(z.string().url()).max(4, 'Maximum 4 media files').optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

// ============================================
// Story Schemas
// ============================================
export const createStorySchema = z.object({
  media_url: z.string().url('Invalid media URL'),
  media_type: z.enum(['image', 'video']),
});

// ============================================
// Reaction Schemas
// ============================================
export const createReactionSchema = z.object({
  type: z.enum(['like', 'love', 'laugh', 'wow', 'sad', 'angry']),
});

// ============================================
// Follow Schemas
// ============================================
export const createFollowSchema = z.object({
  following_id: z.string().uuid('Invalid user ID'),
});

// ============================================
// Marketplace Schemas
// ============================================
export const createMarketplaceItemSchema = z.object({
  title: z.string().min(1).max(200, 'Title too long'),
  description: z.string().min(1).max(5000, 'Description too long'),
  category: z.string().min(1),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('CAD'),
  images: z.array(z.string().url()).min(1, 'At least one image required').max(10),
});

export const updateMarketplaceItemSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  price: z.number().min(0).optional(),
  is_available: z.boolean().optional(),
});

// ============================================
// AI Schemas
// ============================================
export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1),
  })).min(1),
  useTiGuy: z.boolean().default(true),
});

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  type: z.enum(['general', 'studio', 'banner', 'product']).default('general'),
  style: z.enum(['realistic', 'artistic', 'anime', 'sketch', 'quebec-inspired']).optional(),
});

export const moderateContentSchema = z.object({
  text: z.string().min(1),
  contentType: z.enum(['post', 'comment', 'message', 'profile']).default('post'),
});

// ============================================
// Pagination Schemas
// ============================================
export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

// ============================================
// Query Parameter Schemas
// ============================================
export const userQuerySchema = z.object({
  username: z.string().optional(),
  search: z.string().optional(),
});

export const postQuerySchema = z.object({
  visibility: z.enum(['public', 'friends', 'private']).optional(),
  user_id: z.string().uuid().optional(),
}).merge(paginationSchema);

export const marketplaceQuerySchema = z.object({
  category: z.string().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  search: z.string().optional(),
}).merge(paginationSchema);
