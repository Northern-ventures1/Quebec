# Next.js 15/16 Async Params Migration

## Overview

This document outlines the migration of all dynamic API route handlers in the Quebec codebase to comply with Next.js 15/16's async params signature requirement.

## Background

Starting with Next.js 15, and enforced in Next.js 16, dynamic route parameters must be accessed asynchronously. This change aligns with React's server component architecture and improves type safety.

### What Changed

**Before (Next.js 14 and earlier):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Direct access to params.id
  const data = await fetchData(params.id);
}
```

**After (Next.js 15/16):**
```typescript
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Async access to params
  const { id } = await context.params;
  const data = await fetchData(id);
}
```

## Files Modified

All dynamic route handlers (routes with `[param]` in their path) were updated:

1. `/src/app/api/comments/[commentId]/route.ts` - 3 handlers (GET, PATCH, DELETE)
2. `/src/app/api/posts/[postId]/route.ts` - 3 handlers (GET, PATCH, DELETE)
3. `/src/app/api/posts/[postId]/comments/route.ts` - 2 handlers (GET, POST)
4. `/src/app/api/posts/[postId]/reactions/route.ts` - 3 handlers (GET, POST, DELETE)
5. `/src/app/api/stories/[storyId]/route.ts` - 2 handlers (GET, DELETE)
6. `/src/app/api/users/[userId]/follow/route.ts` - 2 handlers (POST, DELETE)
7. `/src/app/api/users/[userId]/followers/route.ts` - 1 handler (GET)
8. `/src/app/api/users/[userId]/following/route.ts` - 1 handler (GET)
9. `/src/app/api/users/[userId]/relationship/route.ts` - 1 handler (GET)

**Total:** 9 files, 18 HTTP method handlers updated

## Migration Pattern

For each handler in the affected files, we applied the following transformation:

### Step 1: Update Function Signature
```typescript
// Old signature
function Handler(request: NextRequest, { params }: { params: { paramName: string } })

// New signature
function Handler(request: NextRequest, context: { params: Promise<{ paramName: string }> })
```

### Step 2: Destructure Params Asynchronously
Add at the start of the function body:
```typescript
const { paramName } = await context.params;
```

### Step 3: Replace All References
Replace all `params.paramName` with `paramName` throughout the handler.

## Business Logic Preservation

**No business logic was modified** during this migration. Changes were strictly limited to:
- Handler function signatures
- Parameter destructuring patterns
- Variable references

All:
- Database queries remain unchanged
- Authorization checks remain unchanged
- Validation logic remains unchanged
- Error handling remains unchanged
- Response structures remain unchanged

## Type Safety

The migration maintains full TypeScript type safety:
- All `params` objects are properly typed
- The `await` operation is correctly typed as unwrapping the Promise
- No type assertions or `any` types were introduced

## Performance Considerations

The async params pattern has negligible performance impact:
- The params Promise is typically already resolved by Next.js before the handler executes
- The `await` operation completes synchronously in most cases
- No additional network requests or I/O operations are introduced

## Compatibility

- **Minimum Next.js version:** 15.0.0 (current version in package.json: ^16.0.0)
- **Breaking change:** This migration is not backward compatible with Next.js 14 and earlier
- **Forward compatible:** Fully compatible with Next.js 15 and 16

## Related Documentation

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Migration Completed

- **Date:** December 2025
- **Next.js Version:** ^16.0.0
- **TypeScript Version:** ^5.3.3
- **Migration Status:** ✅ Complete
