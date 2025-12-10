'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-leather-dark to-leather-primary">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gold-primary mb-4">Zyeuté</h1>
        <p className="text-xl text-white mb-8">Quebec's AI-Powered Social Platform</p>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl">
          A modern social platform combining real-time social features, a creator marketplace, and autonomous AI agents.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-gold-primary text-leather-dark font-semibold rounded-lg hover:bg-gold-secondary transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 border-2 border-gold-primary text-gold-primary font-semibold rounded-lg hover:bg-gold-primary hover:text-leather-dark transition"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
            <h3 className="text-xl font-bold text-gold-primary mb-2">🔥 Social Feed</h3>
            <p className="text-gray-300">Real-time posts, stories, and reactions with AI-powered recommendations</p>
          </div>
          <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
            <h3 className="text-xl font-bold text-gold-primary mb-2">🛍️ Marketplace</h3>
            <p className="text-gray-300">Creator marketplace with integrated payments and dispute resolution</p>
          </div>
          <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
            <h3 className="text-xl font-bold text-gold-primary mb-2">🤖 Colony OS</h3>
            <p className="text-gray-300">Autonomous agent system for content moderation and analytics</p>
          </div>
        </div>
      </div>
    </main>
  );
}
