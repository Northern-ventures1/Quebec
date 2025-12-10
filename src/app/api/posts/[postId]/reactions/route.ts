import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

// GET /api/posts/:postId/reactions
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabaseAdmin
      .from('reactions')
      .select(`
        *,
        user:users!reactions_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('post_id', params.postId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('type', type);
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
    console.error('Get reactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
  }
}

// POST /api/posts/:postId/reactions
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId, type } = await request.json();

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'User ID and type are required' },
        { status: 400 }
      );
    }

    if (!['fire', 'heart'].includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('reactions')
      .select('*')
      .eq('post_id', params.postId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      if (existing.type === type) {
        return NextResponse.json({ message: 'Already reacted with this type' }, { status: 200 });
      }
      await supabaseAdmin
        .from('reactions')
        .update({ type })
        .eq('post_id', params.postId)
        .eq('user_id', userId);

      return NextResponse.json({ action: 'updated', type });
    }

    await supabaseAdmin.from('reactions').insert({
      post_id: params.postId,
      user_id: userId,
      type,
    });

    return NextResponse.json({ action: 'added', type }, { status: 201 });
  } catch (error: any) {
    console.error('Add reaction error:', error);
    return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
  }
}

// DELETE /api/posts/:postId/reactions
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('reactions')
      .delete()
      .eq('post_id', params.postId)
      .eq('user_id', userId);

    if (type) {
      query = query.eq('type', type);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ action: 'removed' });
  } catch (error: any) {
    console.error('Remove reaction error:', error);
    return NextResponse.json({ error: 'Failed to remove reaction' }, { status: 500 });
  }
}
