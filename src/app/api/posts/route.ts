import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';
import { generateEmbeddings } from '@/lib/ai/deepseek';

// GET /api/posts - List posts (feed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');
    const authorId = searchParams.get('authorId');
    const visibility = searchParams.get('visibility') || 'public';
    const q = searchParams.get('q'); // Search query

    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        user:users!posts_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        ),
        reaction_count,
        comment_count
      `)
      .eq('visibility', visibility)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    if (authorId) {
      query = query.eq('user_id', authorId);
    }

    if (q) {
      query = query.ilike('content', `%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const nextCursor = data.length === limit ? data[data.length - 1].created_at : null;

    return NextResponse.json({ 
      items: data,
      nextCursor
    });
  } catch (error: any) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts - Create post
export async function POST(request: NextRequest) {
  try {
    const { userId, content, mediaUrls, visibility, pinned } = await request.json();

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'User ID and content are required' },
        { status: 400 }
      );
    }

    const embedding = await generateEmbeddings(content);

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        user_id: userId,
        content,
        media_urls: mediaUrls || [],
        visibility: visibility || 'public',
        pinned: pinned || false,
        embedding,
      })
      .select(`
        *,
        user:users!posts_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
