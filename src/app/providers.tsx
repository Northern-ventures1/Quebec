'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from '@/lib/auth';

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
