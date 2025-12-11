import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await context.params;
  
  try {
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select(`
        *,
        user:users!comments_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('id', commentId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ comment: data });
  } catch (error: any) {
    console.error('Get comment error:', error);
    return NextResponse.json({ error: 'Failed to fetch comment' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await context.params;
  
  try {
    const { userId, body } = await request.json();

    const { data: existing } = await supabaseAdmin
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (!existing || existing.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ body, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data });
  } catch (error: any) {
    console.error('Edit comment error:', error);
    return NextResponse.json({ error: 'Failed to edit comment' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await context.params;
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (!existing || existing.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabaseAdmin.from('comments').delete().eq('id', commentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
