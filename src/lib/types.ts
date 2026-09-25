export type Membership = {
  active: boolean;
  member: boolean;
  purchase_count: number;
  started_at: string | null;
  expires_at: string | null;
};

export type User = {
  id: number;
  email: string;
  nickname: string;
  city: string;
  github_username: string;
  website_url: string;
  avatar_url: string;
  role: 'student' | 'admin';
  membership?: Membership;
  created_at: string;
  last_active_at: string;
};

export type Course = {
  code: string;
  title: string;
  summary: string;
  docs_path: string;
  cover_url?: string;
  access_mode: 'public' | 'member';
  chapter_count: number;
};

export type MembershipResponse = {
  membership: Membership;
  provider_enabled: boolean;
  price_cents: number;
};

export type LearningHistoryItem = {
  path: string;
  title: string;
  visited_at: string;
};
