import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ user: null, session: null });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      return NextResponse.json({ user: null, session: null });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null, session: null });
  }
}
