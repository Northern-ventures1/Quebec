# 🔍 Zyeuté Architecture Audit & Code Review

**Date:** December 10, 2025  
**Goal:** Zero mistakes from the beginning - comprehensive review before building new features

---

## 📋 Executive Summary

### Current State
- ✅ **Foundation:** Solid Next.js 16 + Supabase + Stripe setup
- ⚠️ **Architecture:** Mixed - some routes exist but need consistency review
- ⚠️ **Security:** Auth scaffolded but needs comprehensive middleware
- ⚠️ **Data Layer:** Schema not yet created in Supabase
- ⚠️ **Testing:** Setup complete but no tests written

### Priority Actions
1. 🔴 **CRITICAL:** Create Supabase schema with RLS policies
2. 🟠 **HIGH:** Standardize API route structure & error handling
3. 🟡 **MEDIUM:** Add auth middleware to all protected routes
4. 🟢 **LOW:** Write tests for existing endpoints

---

## 🏗️ Layer 1: Architecture Review

### Current Folder Structure

```
Quebec/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/              ✅ GOOD: DeepSeek + FAL integration
│   │   │   ├── auth/            ✅ GOOD: Complete auth routes
│   │   │   ├── comments/        ⚠️  REVIEW: Check consistency
│   │   │   ├── posts/           ⚠️  REVIEW: Check consistency
│   │   │   ├── stories/         ⚠️  REVIEW: Check consistency
│   │   │   ├── stripe/          ✅ GOOD: Webhooks + checkout
│   │   │   └── users/           ⚠️  REVIEW: Check consistency
│   │   ├── layout.tsx           ✅ GOOD
│   │   ├── page.tsx             ✅ GOOD
│   │   ├── providers.tsx        ✅ GOOD
│   │   └── globals.css          ✅ GOOD
│   ├── components/
│   │   ├── Avatar.tsx           ✅ GOOD
│   │   └── GoldButton.tsx       ✅ GOOD
│   ├── hooks/
│   │   └── useUser.ts           ✅ GOOD
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── deepseek.ts      ✅ GOOD: No OpenAI dependency
│   │   │   └── fal.ts           ✅ GOOD: Image generation
│   │   ├── db/
│   │   │   └── client.ts        ✅ GOOD: Supabase clients
│   │   ├── auth.ts              ✅ GOOD: Session provider
│   │   ├── stripe.ts            ✅ GOOD: Payment integration
│   │   └── utils.ts             ✅ GOOD: Helper functions
│   └── types/
│       └── index.ts             ✅ GOOD: TypeScript types
└── tests/                       ⚠️  EMPTY: Need to write tests
```

### Architecture Issues Found

#### 🔴 CRITICAL Issues
1. **Missing Database Schema**
   - No `supabase/` directory with migrations
   - Schema not defined in codebase
   - RLS policies not documented
   - **Action:** Create complete schema before building features

2. **No Auth Middleware**
   - Protected routes lack authentication checks
   - No role-based access control (RBAC)
   - **Action:** Create `src/middleware.ts` for route protection

#### 🟠 HIGH Priority Issues
1. **API Route Inconsistency**
   - Some routes may not follow REST conventions
   - Need to verify: posts, comments, stories, users
   - **Action:** Audit each route against REST checklist

2. **No Error Handling Strategy**
   - Each route handles errors differently
   - No centralized error response format
   - **Action:** Create error utility with standard shapes

3. **Missing Rate Limiting**
   - AI endpoints vulnerable to abuse
   - Auth endpoints need protection
   - **Action:** Add rate limiting middleware

#### 🟡 MEDIUM Priority Issues
1. **No Input Validation**
   - Request bodies not validated with Zod schemas
   - **Action:** Create validation schemas for all endpoints

2. **Missing Pagination**
   - List endpoints need cursor-based pagination
   - **Action:** Add pagination to GET /posts, /comments, etc.

3. **No Logging Strategy**
   - Console.log scattered throughout
   - **Action:** Implement structured logging

---

## 🌐 Layer 2: API Design Review

### REST API Best Practices Checklist

#### ✅ Current Good Practices
- Proper HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response bodies
- Status codes used (200, 400, 401, 500)
- Nested resources for related entities

#### ⚠️ Issues to Fix

**1. API Versioning**
- ❌ Current: `/api/posts`
- ✅ Should be: `/api/v1/posts`
- **Reason:** Allows backward-compatible changes

**2. Resource Naming**
- ❌ Current: May have singular forms
- ✅ Should be: Always plural (`/posts`, `/users`, `/comments`)

**3. Pagination**
- ❌ Current: No pagination on list endpoints
- ✅ Should be: Cursor-based pagination
```json
{
  "data": [...],
  "cursor": "eyJpZCI6MTIzfQ==",
  "has_more": true
}
```

**4. Error Responses**
- ❌ Current: Inconsistent error shapes
- ✅ Should be: Standardized format
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email is required",
    "field": "email"
  }
}
```

**5. Authentication**
- ❌ Current: No consistent auth pattern
- ✅ Should be: Bearer token in all protected routes
```
Authorization: Bearer <supabase_jwt>
```

### Recommended API Structure

```
/api/v1/
├── auth/
│   ├── POST   /signup
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /refresh
│   └── GET    /session
│
├── users/
│   ├── GET    /users/:id
│   ├── PATCH  /users/:id
│   ├── GET    /users/:id/posts
│   ├── GET    /users/:id/followers
│   └── GET    /users/:id/following
│
├── posts/
│   ├── GET    /posts           (paginated, filterable)
│   ├── POST   /posts
│   ├── GET    /posts/:id
│   ├── PATCH  /posts/:id
│   ├── DELETE /posts/:id
│   ├── POST   /posts/:id/react
│   └── DELETE /posts/:id/react
│
├── comments/
│   ├── GET    /posts/:postId/comments
│   ├── POST   /posts/:postId/comments
│   ├── PATCH  /comments/:id
│   └── DELETE /comments/:id
│
├── stories/
│   ├── GET    /stories         (auto-delete after 24h)
│   ├── POST   /stories
│   ├── GET    /stories/:id
│   └── DELETE /stories/:id
│
├── follows/
│   ├── POST   /follows         (body: {followingId})
│   └── DELETE /follows/:id
│
├── marketplace/
│   ├── GET    /marketplace/items
│   ├── POST   /marketplace/items
│   ├── GET    /marketplace/items/:id
│   ├── PATCH  /marketplace/items/:id
│   └── DELETE /marketplace/items/:id
│
├── stripe/
│   ├── POST   /stripe/checkout
│   ├── POST   /stripe/webhooks
│   ├── POST   /stripe/billing-portal
│   └── POST   /stripe/payment-intent
│
└── ai/
    ├── POST   /ai/chat
    ├── POST   /ai/generate-image
    ├── POST   /ai/moderate
    └── POST   /ai/embeddings
```

---

## 🗄️ Layer 3: Data Layer Review

### Required Supabase Schema

#### Tables Needed

**1. users** (extends auth.users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  auth_provider TEXT DEFAULT 'supabase',
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_tier TEXT CHECK (premium_tier IN ('free', 'supporter', 'vip')),
  reputation_score INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**2. posts**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  comment_count INTEGER DEFAULT 0,
  reaction_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

**3. comments**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

**4. stories**
```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  view_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
```

**5. reactions**
```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_reactions_post_id ON reactions(post_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);
```

**6. follows**
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

**7. subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'supporter', 'vip')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**8. marketplace_items**
```sql
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  images TEXT[] NOT NULL,
  is_available BOOLEAN DEFAULT true,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketplace_seller_id ON marketplace_items(seller_id);
CREATE INDEX idx_marketplace_category ON marketplace_items(category);
```

**9. orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  item_id UUID NOT NULL REFERENCES marketplace_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  payment_intent_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'canceled', 'disputed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**10. ai_usage_logs**
```sql
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('chat', 'image_generation', 'moderation', 'embeddings')),
  model TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_logs_created_at ON ai_usage_logs(created_at DESC);
```

**11. moderation_logs**
```sql
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL,
  content_text TEXT,
  flagged BOOLEAN DEFAULT false,
  categories JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row-Level Security (RLS) Policies

**Critical:** All tables MUST have RLS enabled

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies for posts table
CREATE POLICY "Users can view public posts"
  ON posts FOR SELECT
  USING (visibility = 'public' AND is_deleted = false);

CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🔒 Layer 4: Cross-Cutting Concerns

### 1. Error Handling

**Create:** `src/lib/errors.ts`
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public field?: string
  ) {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        field: error.field,
      },
      status: error.statusCode,
    };
  }
  
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    status: 500,
  };
}
```

### 2. Input Validation

**Create:** `src/schemas/` directory with Zod schemas
```typescript
import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  media_urls: z.array(z.string().url()).optional(),
  visibility: z.enum(['public', 'friends', 'private']).default('public'),
});

export const updateUserSchema = z.object({
  display_name: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
});
```

### 3. Authentication Middleware

**Create:** `src/middleware.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './lib/db/client';

export async function middleware(request: NextRequest) {
  // Protected routes
  const protectedPaths = ['/api/v1/posts', '/api/v1/comments', '/api/v1/users'];
  
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } },
        { status: 401 }
      );
    }
    
    // Attach user to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};
```

### 4. Rate Limiting

**Add:** Rate limiting for AI and auth routes
```typescript
// src/lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimitCache = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function rateLimit(identifier: string, limit: number = 10) {
  const count = (rateLimitCache.get(identifier) as number) || 0;
  
  if (count >= limit) {
    return false;
  }
  
  rateLimitCache.set(identifier, count + 1);
  return true;
}
```

### 5. Logging

**Add:** Structured logging
```typescript
// src/lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: unknown, meta?: object) => {
    console.error(JSON.stringify({ level: 'error', message, error, ...meta, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, meta?: object) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
  },
};
```

---

## ✅ Action Plan

### Phase 1: Foundation (Do First) 🔴
1. [ ] Create Supabase migration files in `supabase/migrations/`
2. [ ] Apply schema to Supabase project
3. [ ] Enable RLS on all tables
4. [ ] Create `src/lib/errors.ts` for standardized errors
5. [ ] Create `src/schemas/` directory with Zod validation
6. [ ] Create `src/middleware.ts` for auth protection

### Phase 2: API Standardization 🟠
1. [ ] Migrate all routes to `/api/v1/` structure
2. [ ] Audit existing routes against REST checklist
3. [ ] Add pagination to all list endpoints
4. [ ] Implement consistent error handling
5. [ ] Add input validation to all routes
6. [ ] Add rate limiting to AI and auth routes

### Phase 3: Testing 🟡
1. [ ] Write unit tests for utilities
2. [ ] Write integration tests for API routes
3. [ ] Write E2E tests for critical flows
4. [ ] Set up CI/CD to run tests

### Phase 4: Documentation 🟢
1. [ ] Document all API endpoints
2. [ ] Create API usage examples
3. [ ] Write deployment guide
4. [ ] Create security audit checklist

---

## 📊 Current Score: 6/10

**Strengths:**
- ✅ Modern tech stack (Next.js 16, TypeScript, Supabase)
- ✅ No OpenAI dependency (using DeepSeek + FAL)
- ✅ Good component structure
- ✅ Stripe integration complete

**Critical Gaps:**
- ❌ No database schema deployed
- ❌ No auth middleware
- ❌ No input validation
- ❌ Inconsistent API design
- ❌ No tests

**Target Score: 10/10 after Phase 1 & 2**

---

## 🚨 Stop and Review

**BEFORE writing any new features:**
1. ✅ Review this entire document
2. ✅ Complete Phase 1 tasks
3. ✅ Audit existing API routes
4. ✅ Create database schema
5. ✅ Add auth middleware

**Only then proceed to build new features.**

---

**Status:** 🟡 Foundation solid, architecture needs cleanup before scale
