# 🚀 Next.js 16 Async Params Migration Guide

**Issue:** Next.js 15/16 requires `params` to be async (Promise-based) in all dynamic route handlers.

**Status:** ✅ Fixed `comments/[commentId]/route.ts`
**Remaining:** ~19 route files need updating

---

## 🎯 The Problem

### Old Pattern (Next.js 14):
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id; // ❌ Synchronous access
  // ...
}
```

### New Pattern (Next.js 15/16):
```typescript
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ Async access
  // ...
}
```

---

## 📝 Files That Need Fixing

### ✅ Already Fixed:
1. `src/app/api/comments/[commentId]/route.ts`

### ❌ Need Fixing:

#### Posts Routes:
2. `src/app/api/posts/[postId]/route.ts`
3. `src/app/api/posts/[postId]/comments/route.ts`
4. `src/app/api/posts/[postId]/reactions/route.ts`

#### Stories Routes:
5. `src/app/api/stories/[storyId]/route.ts`

#### Users Routes:
6. `src/app/api/users/[userId]/route.ts` (if exists)
7. `src/app/api/users/[userId]/follow/route.ts`
8. `src/app/api/users/[userId]/followers/route.ts`
9. `src/app/api/users/[userId]/following/route.ts`
10. `src/app/api/users/[userId]/relationship/route.ts`

#### Marketplace Routes:
11. `src/app/api/marketplace/[itemId]/route.ts` (if exists)
12. `src/app/api/orders/[orderId]/route.ts` (if exists)

#### AI Routes:
13. `src/app/api/ai/[sessionId]/route.ts` (if exists)

---

## 🔧 Quick Fix Pattern

### For Single Param Routes:

**Search for:**
```typescript
{ params }: { params: { PARAM_NAME: string } }
```

**Replace with:**
```typescript
context: { params: Promise<{ PARAM_NAME: string }> }
```

**Then add at start of function:**
```typescript
const { PARAM_NAME } = await context.params;
```

### Example Fix:

**Before:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const post = await db.posts.get(params.postId);
  // ...
}
```

**After:**
```typescript
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;
  const post = await db.posts.get(postId);
  // ...
}
```

---

## ⚡ Automated Fix Script

### Using VS Code:

1. **Find:** `{ params }: { params: { ([^}]+): string } }`
2. **Replace:** `context: { params: Promise<{ $1: string }> }`
3. **Then manually add:** `const { $1 } = await context.params;` at function start

### Using sed (Terminal):

```bash
# Backup first!
cp src/app/api/posts/[postId]/route.ts src/app/api/posts/[postId]/route.ts.bak

# Fix the type signature
sed -i '' 's/{ params }: { params: { \([^}]*\): string } }/context: { params: Promise<{ \1: string }> }/g' src/app/api/posts/[postId]/route.ts

# Then manually add: const { paramName } = await context.params;
```

---

## 📋 Manual Fix Checklist

For each file:

- [ ] Update GET handler
- [ ] Update POST handler (if exists)
- [ ] Update PATCH handler (if exists)
- [ ] Update PUT handler (if exists)
- [ ] Update DELETE handler (if exists)
- [ ] Add `const { paramName } = await context.params;` at start of each handler
- [ ] Replace all `params.paramName` with just `paramName`
- [ ] Test locally with `npm run build`

---

## 🧪 Testing

### After fixing all files:

```bash
# Clean build
rm -rf .next

# Type check
npm run type-check

# Build
npm run build
```

Should see:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
```

---

## 🚨 Common Mistakes

### ❌ Wrong:
```typescript
const params = await context.params;
const id = params.id; // Extra step
```

### ✅ Right:
```typescript
const { id } = await context.params; // Destructure immediately
```

### ❌ Wrong:
```typescript
// Forgetting to await
const { id } = context.params; // Missing await
```

### ✅ Right:
```typescript
const { id } = await context.params; // Always await
```

---

## 📚 References

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Route Handler API Reference](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Async Request APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)

---

## ✅ Once All Fixed

1. Delete this file: `rm NEXTJS_16_MIGRATION.md`
2. Commit changes: `git commit -m "fix: migrate all routes to Next.js 16 async params"`
3. Push: `git push origin main`
4. Vercel will auto-deploy with successful build! 🎉

---

**Your build will succeed once all dynamic route handlers use async params!**
