import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabaseAdmin
      .from('stories')
      .select(`
        *,
        user:users!stories_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const nextCursor = data.length === limit ? data[data.length - 1].created_at : null;

    return NextResponse.json({ items: data, nextCursor });
  } catch (error: any) {
    console.error('Get stories error:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, mediaUrl, caption, duration, visibility } = await request.json();

    if (!userId || !mediaUrl) {
      return NextResponse.json(
        { error: 'User ID and media URL are required' },
        { status: 400 }
      );
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const { data, error } = await supabaseAdmin
      .from('stories')
      .insert({
        user_id: userId,
        media_url: mediaUrl,
        caption: caption || null,
        duration: duration || 5000,
        visibility: visibility || 'public',
        expires_at: expiresAt.toISOString(),
      })
      .select(`
        *,
        user:users!stories_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ story: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create story error:', error);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}
