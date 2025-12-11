# Changelog

All notable changes to the Quebec project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

#### Next.js 15/16 Async Params Migration - 2025-12-11

**Summary:** Updated all dynamic API route handlers to use Next.js 15/16 async params signature.

**Motivation:** Next.js 15 introduced async params for dynamic routes, and Next.js 16 enforces this pattern. This migration ensures compatibility with the latest Next.js version and improves type safety.

**Technical Changes:**
- Updated 9 dynamic route files containing 18 HTTP method handlers
- Changed handler signatures from `{ params }: { params: { id: string } }` to `context: { params: Promise<{ id: string }> }`
- Added async destructuring: `const { id } = await context.params` at the start of each handler
- Replaced all `params.id` references with the destructured `id` variable

**Modified Files:**
- `src/app/api/comments/[commentId]/route.ts` (GET, PATCH, DELETE)
- `src/app/api/posts/[postId]/route.ts` (GET, PATCH, DELETE)
- `src/app/api/posts/[postId]/comments/route.ts` (GET, POST)
- `src/app/api/posts/[postId]/reactions/route.ts` (GET, POST, DELETE)
- `src/app/api/stories/[storyId]/route.ts` (GET, DELETE)
- `src/app/api/users/[userId]/follow/route.ts` (POST, DELETE)
- `src/app/api/users/[userId]/followers/route.ts` (GET)
- `src/app/api/users/[userId]/following/route.ts` (GET)
- `src/app/api/users/[userId]/relationship/route.ts` (GET)

**Breaking Changes:** None. This is an internal implementation change with no impact on API contracts or behavior.

**Business Logic:** No business logic was modified. All database queries, authorization checks, validation, and error handling remain unchanged.

**Documentation Added:**
- `MIGRATION_NOTES.md` - Detailed migration documentation
- `TEST_PLAN.md` - Testing strategy and validation checklist
- `CHANGELOG.md` - This file

**Next.js Version Compatibility:**
- Minimum: Next.js 15.0.0
- Current: Next.js 16.0.0
- Not backward compatible with Next.js 14

**Related Issues:**
- Requirement: Update to Next.js 16 async params pattern
- Impact: Improved type safety and future compatibility

---

## Version History

### [0.1.0] - 2025

Initial release of Quebec - AI-powered social platform with marketplace and autonomous agents.

**Features:**
- User authentication and authorization
- Social networking (posts, comments, reactions)
- User following system
- Stories feature
- Real-time updates
- Stripe payment integration
- AI-powered features (DeepSeek, FAL)
- PostgreSQL database via Supabase

**Technology Stack:**
- Next.js 16
- React 18
- TypeScript 5
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth)
- Stripe
- AI Integrations

---

## Categories

### Added
New features, endpoints, or capabilities.

### Changed
Changes in existing functionality or behavior.

### Deprecated
Features or APIs that will be removed in future versions.

### Removed
Features or APIs that have been removed.

### Fixed
Bug fixes and error corrections.

### Security
Security improvements and vulnerability fixes.

---

## Notes

- This CHANGELOG was created as part of the Next.js 15/16 async params migration
- Future updates should be added to the `[Unreleased]` section
- When releasing a new version, move unreleased changes to a dated version section
