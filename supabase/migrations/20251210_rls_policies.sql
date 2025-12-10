-- ============================================
-- Row-Level Security (RLS) Policies
-- Date: 2025-12-10
-- Description: Security policies for all tables
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: users
-- ============================================
CREATE POLICY "Users can view all public profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- RLS POLICIES: posts
-- ============================================
CREATE POLICY "Users can view public posts"
  ON posts FOR SELECT
  USING (visibility = 'public' AND is_deleted = false);

CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view friends' posts"
  ON posts FOR SELECT
  USING (
    visibility = 'friends' 
    AND is_deleted = false
    AND EXISTS (
      SELECT 1 FROM follows 
      WHERE follower_id = auth.uid() 
      AND following_id = posts.user_id
    )
  );

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: comments
-- ============================================
CREATE POLICY "Users can view comments on visible posts"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = comments.post_id 
      AND (
        posts.visibility = 'public'
        OR posts.user_id = auth.uid()
        OR (posts.visibility = 'friends' AND EXISTS (
          SELECT 1 FROM follows 
          WHERE follower_id = auth.uid() 
          AND following_id = posts.user_id
        ))
      )
    )
    AND is_deleted = false
  );

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: stories
-- ============================================
CREATE POLICY "Users can view non-expired stories from people they follow"
  ON stories FOR SELECT
  USING (
    expires_at > NOW()
    AND (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = auth.uid() 
        AND following_id = stories.user_id
      )
    )
  );

CREATE POLICY "Authenticated users can create stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: reactions
-- ============================================
CREATE POLICY "Users can view reactions on visible posts"
  ON reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = reactions.post_id 
      AND (posts.visibility = 'public' OR posts.user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can create reactions"
  ON reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: follows
-- ============================================
CREATE POLICY "Users can view all follows"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create follows"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- RLS POLICIES: subscriptions
-- ============================================
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES: marketplace_items
-- ============================================
CREATE POLICY "Users can view available marketplace items"
  ON marketplace_items FOR SELECT
  USING (is_available = true OR seller_id = auth.uid());

CREATE POLICY "Authenticated users can create marketplace items"
  ON marketplace_items FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own items"
  ON marketplace_items FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own items"
  ON marketplace_items FOR DELETE
  USING (auth.uid() = seller_id);

-- ============================================
-- RLS POLICIES: orders
-- ============================================
CREATE POLICY "Users can view their orders as buyer or seller"
  ON orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "System can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Buyers and sellers can update their orders"
  ON orders FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ============================================
-- RLS POLICIES: ai_usage_logs
-- ============================================
CREATE POLICY "Users can view their own AI usage logs"
  ON ai_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create AI usage logs"
  ON ai_usage_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES: moderation_logs
-- ============================================
CREATE POLICY "Admins can view moderation logs"
  ON moderation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_verified = true
    )
  );

CREATE POLICY "System can create moderation logs"
  ON moderation_logs FOR INSERT
  WITH CHECK (true);
