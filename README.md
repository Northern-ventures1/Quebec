# Zyeuté - Quebec's AI-Powered Social Platform

**Status:** Phase 1 Complete ✅ - Ready to connect to your existing Supabase

---

## ⚡ Quick Start (10 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Test connection
npx ts-node scripts/test-connection.ts

# 4. Start development
npm run dev
```

**See:** [QUICK_START.md](./QUICK_START.md) for detailed setup

---

## 💡 What is Zyeuté?

A modern social platform for Quebec featuring:

- 👥 **Social Feed** - Posts, comments, reactions, real-time updates
- 📸 **Stories** - 24-hour ephemeral content
- 🛍️ **Creator Marketplace** - Buy/sell digital goods with Stripe
- 🤖 **Ti-Guy AI** - Quebec's AI assistant (DeepSeek + FAL)
- 💳 **Premium Tiers** - Supporter & VIP subscriptions
- 🎨 **AI Studio** - Image generation for content creators

---

## 📊 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|----------|
| **Framework** | Next.js 16 (React 18) | Full-stack app |
| **Database** | Supabase (PostgreSQL) | Data + Auth + Real-time |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **AI Chat** | DeepSeek | Cost-effective alternative to OpenAI |
| **AI Images** | FAL AI | Fast image generation |
| **Payments** | Stripe | Subscriptions + Marketplace |
| **Auth** | Supabase Auth | JWT + OAuth |
| **Testing** | Vitest + Playwright | Unit + E2E |
| **Types** | TypeScript 5.3 | Type safety |

⚠️ **Note:** NO OpenAI dependency - using DeepSeek for 214x cost savings!

---

## 📁 Project Structure

```
Quebec/
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Login, signup, OAuth
│   │   │   ├── stripe/       # Payments, webhooks
│   │   │   ├── ai/           # Chat, image generation
│   │   │   ├── posts/        # Social feed
│   │   │   ├── comments/     # Post comments
│   │   │   ├── stories/      # 24hr stories
│   │   │   └── users/        # User profiles
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx        # Root layout
│   ├── components/        # React components
│   ├── lib/
│   │   ├── ai/            # DeepSeek + FAL integration
│   │   ├── db/            # Supabase client
│   │   ├── auth.ts        # Authentication
│   │   ├── stripe.ts      # Stripe integration
│   │   ├── errors.ts      # Error handling
│   │   ├── logger.ts      # Structured logging
│   │   ├── rate-limit.ts  # Rate limiting
│   │   └── validation.ts  # Input validation
│   ├── schemas/           # Zod validation schemas
│   ├── types/             # TypeScript types
│   ├── hooks/             # React hooks
│   └── middleware.ts      # Auth middleware
├── supabase/
│   ├── migrations/        # SQL migrations
│   └── README.md          # DB setup guide
├── scripts/
│   └── test-connection.ts # Connection test
├── tests/                 # Unit + E2E tests
└── public/                # Static assets
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Run production build

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript validation

# Testing
npm run test:run         # Unit tests
npm run test:watch       # Watch mode
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report

# Database
npx ts-node scripts/test-connection.ts  # Test Supabase connection
```

---

## 📚 Documentation

### Essential Reads

1. **[QUICK_START.md](./QUICK_START.md)** - 10-minute setup guide
2. **[ARCHITECTURE_AUDIT.md](./ARCHITECTURE_AUDIT.md)** - Complete system review
3. **[PHASE1_COMPLETION.md](./PHASE1_COMPLETION.md)** - Connection guide
4. **[supabase/README.md](./supabase/README.md)** - Database setup

### Phase Guides

- ✅ **Phase 1:** Foundation (error handling, validation, auth middleware) - COMPLETE
- 🔄 **Phase 2:** API Standardization (Next - after Supabase connection)
- 🔒 **Phase 3:** Testing & Security
- 🚀 **Phase 4:** Deployment

---

## 🚀 Next Steps

### For You Right Now:

1. **Configure .env.local** with your Supabase credentials
2. **Run connection test:** `npx ts-node scripts/test-connection.ts`
3. **Verify which tables exist** in your database
4. **Add missing tables** (subscriptions, marketplace, etc.)
5. **Start dev server:** `npm run dev`
6. **Confirm:** App loads at http://localhost:3000

### Then:

✅ Report back when Supabase is connected  
✅ Decide which of the 11 tables to add  
✅ Move to **Phase 2: API Standardization**  

---

**Built with ❤️ for Quebec** | **Powered by Supabase, DeepSeek, FAL AI, and Stripe**
