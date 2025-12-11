# ⚡ Quick Start - Connect to Existing Supabase

**Goal:** Get your app running with your existing Supabase database in < 10 minutes

---

## Step 1: Install Dependencies (2 min)

```bash
cd Quebec
npm install
```

---

## Step 2: Configure Environment (3 min)

### Get Your Supabase Credentials

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Settings** → **API**
4. Copy these 3 values:

```bash
# Project URL
https://xxxxxxxxxxxxx.supabase.co

# anon/public key (starts with eyJ...)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# service_role key (starts with eyJ...)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Create .env.local

```bash
cp .env.example .env.local
```

### Edit .env.local

```bash
# ============================================
# SUPABASE (YOUR EXISTING PROJECT)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ============================================
# AI SERVICES
# ============================================
VITE_DEEPSEEK_API_KEY=sk-...     # Get at: https://platform.deepseek.com
VITE_FAL_API_KEY=...              # Get at: https://fal.ai

# ============================================
# STRIPE
# ============================================
VITE_STRIPE_PUBLIC_KEY=pk_test_...   # Get at: https://dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_PRICE_SUPPORTER=price_...     # Create in Stripe Dashboard
STRIPE_PRICE_VIP=price_...

# ============================================
# APP
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Zyeuté
NODE_ENV=development
```

---

## Step 3: Test Connection (2 min)

```bash
# Test Supabase connection
npx ts-node scripts/test-connection.ts
```

**Expected output:**
```
✅ Basic connection successful!
📊 Table Status:
   ✅ users
   ✅ posts
   ✅ comments
   ✅ reactions
   ✅ follows
   ❌ subscriptions       <- Add if you need Stripe
   ❌ marketplace_items   <- Add if you need marketplace
   ❌ orders              <- Add if you need marketplace
   ❌ stories             <- Add if you need 24hr stories
   ❌ ai_usage_logs       <- Add for AI tracking
   ❌ moderation_logs     <- Add for moderation tracking

✅ Auth configuration OK
✅ Service role permissions OK
```

---

## Step 4: Add Missing Tables (3 min)

### Check What You Have

Based on the test results, add only what's missing:

### Option A: Add Subscriptions Only (for Stripe)

```bash
# Go to: https://supabase.com/dashboard → SQL Editor
# Copy from: supabase/migrations/20251210_initial_schema.sql
# Lines 65-85 (subscriptions table)
# Paste and run
```

### Option B: Add All New Tables

```bash
# Go to: https://supabase.com/dashboard → SQL Editor
# Copy entire file: supabase/migrations/20251210_initial_schema.sql
# Paste and run (it will skip existing tables)
```

### Option C: Add Nothing (use existing schema)

Skip this step if your existing tables are enough!

---

## Step 5: Start Development Server (1 min)

```bash
npm run dev
```

**Open:** http://localhost:3000

**You should see:**
- ✅ Landing page loads
- ✅ No Supabase connection errors
- ✅ Auth buttons visible

---

## ✅ Success Checklist

- [ ] `npm install` completed
- [ ] `.env.local` created with Supabase credentials
- [ ] DeepSeek API key added
- [ ] FAL AI key added
- [ ] Stripe keys added
- [ ] Connection test passes
- [ ] Missing tables added (if needed)
- [ ] `npm run dev` runs without errors
- [ ] http://localhost:3000 loads

---

## 🎯 What You Have Now

✅ **Connected to your existing Supabase**  
✅ **Error handling utilities** (`src/lib/errors.ts`)  
✅ **Input validation** (`src/schemas/`)  
✅ **Rate limiting** (`src/lib/rate-limit.ts`)  
✅ **Structured logging** (`src/lib/logger.ts`)  
✅ **Auth middleware** (`src/middleware.ts`)  
✅ **AI integration** (DeepSeek + FAL, no OpenAI)  
✅ **Stripe integration** (checkout, webhooks, billing)  

---

## 🚀 Ready for Phase 2?

Once everything above is ✅, you're ready to:

1. **Standardize API routes** to `/api/v1/` structure
2. **Add pagination** to list endpoints
3. **Integrate validation** on all routes
4. **Add rate limiting** to AI/auth routes
5. **Build new features** on solid foundation

---

## 🆘 Troubleshooting

**Connection test fails:**
- Verify Supabase URL format: `https://xxxxx.supabase.co`
- Check keys are from **Settings → API** (not project settings)
- Ensure no extra spaces in `.env.local`

**Table not found errors:**
- Your existing DB might use different table names
- Update `src/types/index.ts` to match your schema
- Or rename tables in Supabase to match expected names

**Auth middleware blocks everything:**
- Check `src/middleware.ts` PROTECTED_ROUTES list
- Ensure `/api/v1/auth/*` is in PUBLIC_ROUTES
- Test with service role key first (bypasses RLS)

**Dev server won't start:**
- Run `npm run type-check` to see TypeScript errors
- Delete `.next` folder: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

---

**Status:** Ready to connect! 🔌

**Time to complete:** ~10 minutes

**Next step:** Configure `.env.local` and run connection test!
