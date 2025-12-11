# 🔍 Vercel Build Debugging Guide

**Issue:** Build appears stuck or hanging during deployment

---

## ✅ Quick Fixes to Try (In Order)

### 1. **Cancel Current Build and Redeploy Without Cache**

1. Go to Vercel Dashboard → Your Project
2. Find the stuck deployment
3. Click "Cancel Deployment"
4. Click "Redeploy" → **Uncheck "Use existing Build Cache"**
5. Deploy

**Why:** Bad cache can cause infinite loops or hangs

---

### 2. **Check Build Logs - Last Lines**

Look at where it stops:

**Common hang points:**

```bash
# Hung at dependencies
"Installing dependencies..."
→ Fix: Check for conflicting peer dependencies

# Hung at Next.js compilation
"Creating an optimized production build..."
→ Fix: Check for infinite loops in components/pages

# Hung at static page generation
"Generating static pages (X/Y)"
→ Fix: Check for API calls during SSG without proper error handling

# No output for 10+ minutes
→ Fix: Likely code issue (infinite loop, memory leak)
```

---

### 3. **Test Build Locally**

```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install

# Run production build
NODE_ENV=production npm run build

# If it hangs locally, you have a code issue
# If it works locally, it's a Vercel config issue
```

---

## 🔧 Common Fixes for Quebec Project

### **Fix 1: Simplify Build Command**

Vercel might be timing out. Try removing `vercel-build`:

**In Vercel Dashboard → Settings → Build & Development:**
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

Then remove this from `package.json`:
```diff
- "vercel-build": "npm run build"
```

---

### **Fix 2: Add Build Timeout Override**

Create `vercel.json` in root:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 60
      }
    }
  ]
}
```

---

### **Fix 3: Check for Missing Environment Variables**

Vercel Dashboard → Settings → Environment Variables:

**Required for build:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Optional (but won't break build if missing):**
- `VITE_DEEPSEEK_API_KEY`
- `VITE_FAL_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLIC_KEY`

**Make sure they're set for:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

### **Fix 4: Disable Static Optimization for Now**

In `next.config.js`, add:

```javascript
export default {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable static optimization to test
  experimental: {
    appDir: true,
  },
  
  // Skip static page generation for now
  output: 'standalone',
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.stripe.com' },
      { protocol: 'https', hostname: 'fal.media' },
    ],
  },
  
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};
```

---

### **Fix 5: Check for Code Issues**

**Potential hang causes in your codebase:**

1. **Infinite loops in components:**
   ```typescript
   // BAD - causes hang
   const MyComponent = () => {
     const [data, setData] = useState([]);
     
     useEffect(() => {
       // No dependency array = runs infinitely
       fetchData().then(setData);
     }); // ❌ Missing dependency array
   };
   ```

2. **API calls during SSG without error handling:**
   ```typescript
   // In app/page.tsx or similar
   export default async function Page() {
     // If this fails, it can hang the build
     const data = await fetch('https://api.example.com/data');
     // ❌ No error handling
   }
   ```

3. **Missing await in Server Components:**
   ```typescript
   // BAD
   export default function Page() {
     const data = fetchData(); // ❌ Missing await
     return <div>{data}</div>;
   }
   ```

---

## 🎯 Recommended Actions (Priority Order)

### **Immediate (Do First):**

1. ✅ Cancel stuck build
2. ✅ Redeploy without cache
3. ✅ Check last line of build log
4. ✅ Verify all required env vars in Vercel

### **If Still Stuck:**

5. ✅ Test `npm run build` locally
6. ✅ Add `vercel.json` with timeout
7. ✅ Simplify `next.config.js` (remove experimental features)
8. ✅ Check for code issues (infinite loops)

### **Nuclear Option:**

9. ✅ Create new Vercel project
10. ✅ Deploy with minimal config first
11. ✅ Add features incrementally

---

## 📊 What to Report Back

**If build still hangs, provide:**

1. **Last 30 lines of build log** (copy/paste or screenshot)
2. **Where it stops:** (e.g., "Creating an optimized production build...")
3. **Time stuck:** (e.g., "45 minutes at same line")
4. **Local build result:** (Does `npm run build` work locally?)
5. **Environment variables:** (Are they all set in Vercel?)

---

## 🚨 Known Issues with Your Stack

### **Tailwind CSS 4 (Alpha)**
- Tailwind 4 is in alpha and can cause build issues
- Consider downgrading to v3 if build hangs:
  ```bash
  npm install -D tailwindcss@3 @tailwindcss/postcss@3
  ```

### **Next.js 16 (Canary)**
- Next.js 16 is not stable yet
- Consider using Next.js 15 stable:
  ```bash
  npm install next@15
  ```

### **Deprecated Supabase Auth Helpers**
- Your build warnings show deprecated packages:
  ```
  @supabase/auth-helpers-nextjs@0.10.0 is deprecated
  ```
- Consider migrating to `@supabase/ssr`

---

## ✅ Quick Verification Checklist

- [ ] Vercel build command is `npm run build` (not `vercel build`)
- [ ] Output directory is `.next`
- [ ] Install command is `npm install`
- [ ] All env vars set in Vercel for Production + Preview
- [ ] No `vercel.json` conflicts
- [ ] No infinite loops in React components
- [ ] No unhandled API calls in Server Components
- [ ] Local build works: `npm run build`
- [ ] Cache cleared on Vercel
- [ ] Using stable versions (not alpha/canary)

---

**Current Status:** Awaiting build log details to diagnose further 🔍
