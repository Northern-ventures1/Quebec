import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

// GET /api/posts/:postId
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId');

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        user:users!posts_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        ),
        reaction_count,
        comment_count
      `)
      .eq('id', params.postId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let userReaction = null;
    if (currentUserId) {
      const { data } = await supabaseAdmin
        .from('reactions')
        .select('type')
        .eq('post_id', params.postId)
        .eq('user_id', currentUserId)
        .single();
      userReaction = data?.type || null;
    }

    return NextResponse.json({ post, userReaction });
  } catch (error: any) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PATCH /api/posts/:postId
export async function PATCH(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId, content, visibility, pinned } = await request.json();

    const { data: existingPost } = await supabaseAdmin
      .from('posts')
      .select('user_id')
      .eq('id', params.postId)
      .single();

    if (!existingPost || existingPost.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({ content, visibility, pinned, updated_at: new Date().toISOString() })
      .eq('id', params.postId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/:postId
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: existingPost } = await supabaseAdmin
      .from('posts')
      .select('user_id')
      .eq('id', params.postId)
      .single();

    if (!existingPost || existingPost.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabaseAdmin.from('posts').delete().eq('id', params.postId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
