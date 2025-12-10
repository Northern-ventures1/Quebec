export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  is_verified: boolean;
  is_premium: boolean;
  premium_tier?: 'vip' | 'supporter';
  reputation_score: number;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  visibility: 'public' | 'friends' | 'private';
  comment_count: number;
  reaction_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  media_urls?: string[];
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  is_available: boolean;
  sold_count: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  tier: 'free' | 'supporter' | 'vip';
  status: 'active' | 'canceled';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}
