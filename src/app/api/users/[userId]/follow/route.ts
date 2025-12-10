import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { followerId } = await request.json();

    if (!followerId) {
      return NextResponse.json({ error: 'Follower ID required' }, { status: 400 });
    }

    if (followerId === params.userId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('followee_id', params.userId)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already following' }, { status: 200 });
    }

    await supabaseAdmin.from('follows').insert({
      follower_id: followerId,
      followee_id: params.userId,
    });

    await supabaseAdmin.from('notifications').insert({
      recipient_id: params.userId,
      actor_id: followerId,
      type: 'follow',
      message: 'started following you',
    });

    return NextResponse.json({ action: 'followed' }, { status: 201 });
  } catch (error: any) {
    console.error('Follow error:', error);
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('followerId');

    if (!followerId) {
      return NextResponse.json({ error: 'Follower ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('followee_id', params.userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ action: 'unfollowed' });
  } catch (error: any) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 });
  }
}
