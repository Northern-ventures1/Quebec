# 🚀 Zyeuté Monorepo - Setup Instructions

**Status:** ✅ Enterprise repository fully scaffolded  
**Framework:** Next.js 16 (React 18)  
**Database:** Supabase (PostgreSQL + pgvector)  
**Payments:** Stripe  
**AI Services:** OpenAI, DeepSeek, FAL  
**Deployment:** Vercel-ready  

---

## ⚡ Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/Northern-ventures1/Quebec.git
cd Quebec
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Fill in your API keys:
- **Supabase:** https://supabase.com → Copy URL + Anon Key + Service Role Key
- **OpenAI:** https://platform.openai.com → Copy API Key
- **Stripe:** https://dashboard.stripe.com → Copy Publishable + Secret Keys
- **Google OAuth:** https://console.cloud.google.com → Copy Client ID + Secret

### 3. Run Development Server
```bash
npm run dev
```

Open **http://localhost:3000** — You should see the Zyeuté landing page! 🎉

---

## 📁 Project Structure

```
Quebec/
├── src/
│   ├── app/                     # Next.js 16 pages & layouts
│   │   ├── page.tsx             # Landing page (Leather/Gold theme)
│   │   ├── layout.tsx           # Root layout
│   │   ├── providers.tsx        # Context providers
│   │   ├── globals.css          # Global styles
│   │   └── api/                 # API routes (to build)
│   │
│   ├── components/              # React components
│   │   ├── Avatar.tsx           # User avatar component
│   │   └── GoldButton.tsx       # Theme button component
│   │
│   ├── lib/
│   │   ├── auth.ts              # Supabase authentication
│   │   ├── stripe.ts            # Stripe integration
│   │   ├── db/
│   │   │   └── client.ts        # Supabase client
│   │   ├── ai/
│   │   │   └── openai.ts        # OpenAI integration
│   │   └── utils.ts             # Utility functions
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript types (User, Post, etc.)
│   │
│   ├── hooks/
│   │   └── useUser.ts           # Custom React hook
│   │
│   └── styles/                  # CSS files (to create)
│
├── packages/                    # Monorepo workspaces (optional)
│   ├── kernel-node/             # Colony OS agent engine
│   └── bee-node/                # Secondary agent framework
│
├── tests/                       # Test files (to create)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/                      # Static assets
├── .github/workflows/           # CI/CD pipelines (to create)
│
├── .env.example                 # Environment variables template
├── package.json                 # Root dependencies
├── tsconfig.json                # TypeScript config
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind CSS config
├── vitest.config.ts             # Test config
├── playwright.config.ts         # E2E test config
├── .eslintrc.json               # ESLint config
└── .prettierrc.json             # Prettier config
```

---

## 🎨 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|----------|
| **Frontend** | React 18 + Next.js 16 | UI & pages |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Database** | Supabase (PostgreSQL) | Data persistence |
| **Authentication** | Supabase Auth | User authentication |
| **Payments** | Stripe | Subscriptions & marketplace |
| **AI Services** | OpenAI, DeepSeek, FAL | Chat, embeddings, images |
| **State Management** | React Hooks + Context | Local state |
| **Testing** | Vitest + Playwright | Unit & E2E tests |
| **Deployment** | Vercel | Production hosting |

---

## 🔑 Environment Variables

All required variables are in `.env.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI Services
VITE_OPENAI_API_KEY=sk-...
VITE_DEEPSEEK_API_KEY=sk-...
VITE_FAL_API_KEY=...

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_PRICE_SUPPORTER=price_...
STRIPE_PRICE_VIP=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Zyeuté
NODE_ENV=development

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 📝 Available Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Building
npm run build            # Build for production
npm run start            # Run production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript validation

# Testing
npm run test:run         # Run unit tests
npm run test:watch       # Watch mode for tests
npm run test:e2e         # Run Playwright E2E tests
npm run test:coverage    # Generate coverage report

# Database
npm run db:migrate       # Run database migrations (when ready)

# Health Check
npm run health-check     # Quick health check
```

---

## 🎯 What's Next?

### Phase 1: Foundation (You are here) ✅
- ✅ Next.js 16 monorepo scaffolded
- ✅ Supabase auth integration
- ✅ Stripe payment setup
- ✅ OpenAI/FAL AI integration
- ✅ Tailwind CSS theme (Leather/Gold)
- ✅ TypeScript types & utilities

### Phase 2: Core Features (Next)
1. **Set up Supabase database**
   - Run SQL schema from architecture blueprint
   - Create tables: users, posts, comments, stories, marketplace_items, orders, subscriptions
   - Enable Row-Level Security (RLS)

2. **Build API Routes**
   - `/api/auth/*` - Login, signup, OAuth
   - `/api/stripe/*` - Checkout, webhooks
   - `/api/ai/*` - Chat, embeddings, image generation
   - `/api/social/*` - Posts, comments, reactions

3. **Build Protected Pages**
   - `/feed` - Social feed with real-time updates
   - `/profile` - User profile & settings
   - `/marketplace` - Creator marketplace
   - `/studio` - AI-powered content creator tools
   - `/messages` - Direct messaging

4. **Implement Real-time Features**
   - Supabase subscriptions for live feed
   - Notifications system
   - Presence indicators

5. **Add Colony OS**
   - Agent-based task queue
   - Content moderation agents
   - Analytics aggregation
   - Story auto-deletion

### Phase 3: Polish & Deploy
- Comprehensive E2E tests
- CI/CD with GitHub Actions
- Deploy to Vercel
- Mobile app (React Native)

---

## 🚨 Troubleshooting

**"Module not found '@/'"**
→ Check `tsconfig.json` paths are correct

**"Cannot find Supabase client"**
→ Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

**"Dev server won't start"**
→ Run `npm install` again
→ Clear `.next` folder: `rm -rf .next`
→ Check Node.js version: `node --version` (should be 20+)

**"Stripe key invalid"**
→ Make sure you're using TEST keys for development
→ Format should be: `pk_test_...` and `sk_test_...`

---

## 📚 Documentation Reference

**Architecture Blueprint:**
See the comprehensive guide with:
- Full database schema (12 tables)
- API route structure
- Authentication flow diagrams
- Stripe integration details
- AI services integration
- Colony OS agent architecture
- Testing strategy
- Deployment options
- Security & compliance
- Performance optimization

**Key Files to Review:**
- `src/lib/auth.ts` - Authentication logic
- `src/lib/stripe.ts` - Payment integration
- `src/lib/ai/openai.ts` - AI service integration
- `src/types/index.ts` - TypeScript type definitions
- `tailwind.config.js` - Design system configuration

---

## 🎉 You're Ready!

Your **Zyeuté enterprise monorepo** is now fully set up and ready to build!

**Next step:** Fill in `.env.local` with your API keys and run `npm run dev`

Watch the magic happen at **http://localhost:3000** 🚀

---

**Questions?** Check the Architecture Blueprint document or review the inline code comments!

**Happy coding!** 🔥💎
