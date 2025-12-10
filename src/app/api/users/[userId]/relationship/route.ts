import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    if (!currentUserId) {
      return NextResponse.json({ error: 'Current user ID required' }, { status: 400 });
    }

    const { data: isFollowing } = await supabaseAdmin
      .from('follows')
      .select('*')
      .eq('follower_id', currentUserId)
      .eq('followee_id', params.userId)
      .single();

    const { data: isFollowedBy } = await supabaseAdmin
      .from('follows')
      .select('*')
      .eq('follower_id', params.userId)
      .eq('followee_id', currentUserId)
      .single();

    return NextResponse.json({
      isFollowing: !!isFollowing,
      isFollowedBy: !!isFollowedBy,
      blocked: false,
      muted: false,
    });
  } catch (error: any) {
    console.error('Get relationship error:', error);
    return NextResponse.json({ error: 'Failed to fetch relationship' }, { status: 500 });
  }
}
