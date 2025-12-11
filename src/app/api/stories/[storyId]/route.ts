import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await context.params;
    const { data, error } = await supabaseAdmin
      .from('stories')
      .select(`
        *,
        user:users!stories_user_id_fkey(
          id, username, display_name, avatar_url, is_verified
        )
      `)
      .eq('id', storyId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      return NextResponse.json({ error: 'Story not found or expired' }, { status: 404 });
    }

    return NextResponse.json({ story: data });
  } catch (error: any) {
    console.error('Get story error:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('stories')
      .select('user_id')
      .eq('id', storyId)
      .single();

    if (!existing || existing.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabaseAdmin.from('stories').delete().eq('id', storyId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete story error:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
