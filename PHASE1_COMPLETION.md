# ✅ Phase 1: Foundation - COMPLETION GUIDE

**Status:** Ready to connect to existing Supabase database

---

## 🎯 What We Accomplished

### ✅ 1. Database Schema Created
- Complete SQL migrations for 11 tables
- RLS policies for all tables  
- Indexes for performance
- Triggers for auto-updates and counters
- **Location:** `supabase/migrations/`

### ✅ 2. Error Handling Utilities
- Standardized error responses
- Common error codes
- Error creators for all scenarios
- **Location:** `src/lib/errors.ts`

### ✅ 3. Input Validation
- Zod schemas for all API endpoints
- User, post, comment, story schemas
- Marketplace and AI schemas
- Validation helper functions
- **Location:** `src/schemas/index.ts`

### ✅ 4. Rate Limiting
- Rate limit utility with configurable windows
- Predefined limits for auth, AI, and API routes
- **Location:** `src/lib/rate-limit.ts`

### ✅ 5. Structured Logging
- Production-ready logger with levels
- Pretty printing for development
- JSON logging for production
- **Location:** `src/lib/logger.ts`

### ✅ 6. Auth Middleware
- JWT token verification
- Protected route configuration
- User context attachment
- **Location:** `src/middleware.ts`

---

## 🔗 Connecting to Your Existing Supabase

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your existing project
3. Navigate to: **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

### Step 2: Update Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Step 3: Pull Existing Schema (Optional)

If you want to see what's already in your database:

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Pull existing schema
supabase db dump > supabase/schemas/existing_schema.sql
```

### Step 4: Decide on Migration Strategy

**Option A: Use Existing Schema (Recommended)**
- Keep your current database as-is
- Map existing tables to the new code
- Only add missing tables if needed

**Option B: Apply New Migrations**
- Review the migrations in `supabase/migrations/`
- Apply only what's missing from your existing database
- Use `supabase db diff` to see differences

**Option C: Fresh Start**
- Create a new Supabase project
- Apply all migrations from scratch
- Migrate data from old project (if needed)

### Step 5: Test Connection

Create a test script:

```typescript
// scripts/test-supabase-connection.ts
import { supabase } from './src/lib/db/client';

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Supabase connection successful!');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
  }
}

testConnection();
```

Run it:
```bash
npx ts-node scripts/test-supabase-connection.ts
```

---

## 📊 Mapping Existing Schema to New Code

### If Your Existing Database Has:

**Users table:**
- ✅ Already compatible with `src/types/index.ts` User interface
- Check that you have: `id`, `email`, `username`, `display_name`, etc.

**Posts table:**
- ✅ Map to Post interface in `src/types/index.ts`
- Ensure fields: `user_id`, `content`, `media_urls`, `visibility`

**Comments, Stories, Reactions, Follows:**
- Compare existing columns with schemas in `supabase/migrations/20251210_initial_schema.sql`
- Add missing columns as needed

**Subscriptions (Stripe):**
- If you don't have this table yet, create it:
```bash
supabase db push --file supabase/migrations/20251210_initial_schema.sql
```

**Marketplace & Orders:**
- New features - safe to add these tables

**AI & Moderation Logs:**
- New features - safe to add these tables

---

## 🛠️ Adding Missing Tables Only

### Extract Specific Tables from Migration

1. Open `supabase/migrations/20251210_initial_schema.sql`
2. Copy ONLY the tables you don't have (e.g., `subscriptions`, `marketplace_items`, `orders`)
3. Go to Supabase Dashboard → SQL Editor
4. Paste and run the SQL for missing tables only

### Example: Add Subscriptions Table Only

```sql
-- Run this in Supabase SQL Editor if you don't have subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'supporter', 'vip')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

---

## ✅ Phase 1 Checklist

### Before Moving to Phase 2:

- [ ] Supabase credentials in `.env.local`
- [ ] Connection test passes
- [ ] Database schema reviewed (existing vs. new)
- [ ] Missing tables added (if needed)
- [ ] RLS policies enabled on all tables
- [ ] All utility files created:
  - [ ] `src/lib/errors.ts`
  - [ ] `src/schemas/index.ts`
  - [ ] `src/lib/rate-limit.ts`
  - [ ] `src/lib/logger.ts`
  - [ ] `src/lib/validation.ts`
  - [ ] `src/middleware.ts`

### Verify Each Utility:

```bash
# Type check everything
npm run type-check

# Should pass with no errors
```

---

## 🚀 What's Next: Phase 2

Once Phase 1 is complete:

1. **Standardize existing API routes** to `/api/v1/` structure
2. **Add pagination** to all list endpoints
3. **Integrate utilities** (errors, validation, rate limiting)
4. **Test all endpoints** with proper auth
5. **Build new features** on solid foundation

---

## 📝 Notes

### Using Existing Supabase:
- Your existing database is your source of truth
- Only add what's missing (subscriptions, marketplace, AI logs)
- Don't drop or recreate existing tables
- Use `ALTER TABLE` to add columns if needed

### TypeScript Types:
- Update `src/types/index.ts` to match your actual database schema
- Generate types from Supabase:
  ```bash
  supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts
  ```

### RLS Policies:
- Review existing RLS policies in your database
- Add missing policies from `supabase/migrations/20251210_rls_policies.sql`
- Test policies with different user contexts

---

## 🆘 Troubleshooting

**Connection fails:**
- Verify API keys are correct
- Check project URL format
- Ensure service role key has proper permissions

**Table already exists error:**
- Skip that table in migration
- Or use `CREATE TABLE IF NOT EXISTS`

**RLS blocks all queries:**
- Check if RLS is enabled: `SELECT * FROM pg_tables WHERE schemaname = 'public';`
- Verify policies exist: `SELECT * FROM pg_policies;`
- Test with service role key (bypasses RLS)

---

**Phase 1 Status:** ✅ **COMPLETE - Ready to connect to existing Supabase**

Next step: Configure `.env.local` and test connection!
