# 🗄️ Supabase Database Setup

## Quick Start

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to Your Project
```bash
supabase link --project-ref <your-project-ref>
```

Find your project ref at: https://supabase.com/dashboard/project/_/settings/general

### 4. Apply Migrations
```bash
# Push all migrations to your remote database
supabase db push

# OR apply them manually in Supabase Dashboard:
# 1. Go to: https://supabase.com/dashboard/project/_/sql
# 2. Copy contents of migrations/20251210_initial_schema.sql
# 3. Paste and run
# 4. Copy contents of migrations/20251210_rls_policies.sql  
# 5. Paste and run
```

---

## 📊 Database Schema Overview

### Tables Created (11 total)

1. **users** - User profiles and metadata
2. **posts** - Social media posts
3. **comments** - Post comments
4. **stories** - 24-hour stories
5. **reactions** - Post reactions (like, love, etc.)
6. **follows** - User follow relationships
7. **subscriptions** - Stripe subscription data
8. **marketplace_items** - Creator marketplace listings
9. **orders** - Marketplace orders
10. **ai_usage_logs** - AI service usage tracking
11. **moderation_logs** - Content moderation logs

### Features Included

✅ **Row-Level Security (RLS)** enabled on all tables  
✅ **Indexes** for query performance  
✅ **Triggers** for auto-updating timestamps  
✅ **Triggers** for maintaining counts (followers, posts, etc.)  
✅ **Constraints** for data integrity  
✅ **Foreign keys** with proper cascading  

---

## 🔒 Security (RLS Policies)

### Key Security Rules

- **Users:** Can view all profiles, update only their own
- **Posts:** Can view public posts, friends' posts if following, own posts
- **Comments:** Can view/create on visible posts, manage own comments
- **Stories:** Can view non-expired stories from followed users
- **Reactions:** Can view/create on visible posts, delete own reactions
- **Follows:** Can view all, create/delete own follows
- **Subscriptions:** Can view only their own
- **Marketplace:** Can view available items, manage own listings
- **Orders:** Can view as buyer or seller
- **AI Logs:** Can view own usage
- **Moderation Logs:** Admins only

---

## 🔧 Maintenance

### View All Tables
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### Check RLS Status
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### View Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Reset Database (DANGER - Development Only)
```bash
supabase db reset
```

---

## 📝 Creating New Migrations

### Generate Migration
```bash
supabase migration new <migration_name>
```

### Example: Add a new column
```sql
-- migrations/20251211_add_user_bio.sql
ALTER TABLE users ADD COLUMN bio TEXT;
```

### Apply Migration
```bash
supabase db push
```

---

## 🧹 Testing

### Verify Schema
```bash
# Check if all tables exist
supabase db diff
```

### Test RLS Policies
```sql
-- Switch to test user context
SET LOCAL "request.jwt.claims" TO '{"sub": "user-uuid-here"}';

-- Try to select posts
SELECT * FROM posts WHERE visibility = 'public';
```

---

## 🚀 Production Checklist

- [ ] Migrations applied successfully
- [ ] RLS enabled on all tables
- [ ] Indexes created
- [ ] Triggers working (test counter updates)
- [ ] Foreign keys enforced
- [ ] Test RLS policies with different user contexts
- [ ] Backup strategy configured
- [ ] Connection pooling configured (if needed)

---

## 📚 Resources

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Migrations Guide](https://supabase.com/docs/guides/deployment/database-migrations)
- [Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)

---

**Your database is now production-ready!** 🎉
