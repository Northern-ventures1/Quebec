import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

// GET /api/posts/:postId/comments
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabaseAdmin
      .from('comments')
      .select(`
        *,
        user:users!comments_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('post_id', params.postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (cursor) {
      query = query.gt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const nextCursor = data.length === limit ? data[data.length - 1].created_at : null;

    return NextResponse.json({ items: data, nextCursor });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/posts/:postId/comments
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId, body, parentCommentId } = await request.json();

    if (!userId || !body) {
      return NextResponse.json(
        { error: 'User ID and body are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        post_id: params.postId,
        user_id: userId,
        body,
        parent_comment_id: parentCommentId || null,
      })
      .select(`
        *,
        user:users!comments_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data }, { status: 201 });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
