// src/lib/types.ts

// Placeholder Database type — replace with `npx supabase gen types typescript` output
// after linking to your Supabase project. This placeholder suppresses type errors
// until the real schema types are generated.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableRow = Record<string, any>;
export interface Database {
  public: {
    Tables: {
      posts: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      comments: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      categories: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      profiles: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      car_tags: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      post_tags: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      votes: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      bookmarks: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      notifications: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      rate_limits: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      views: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      error_logs: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      reports: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, any>;
    CompositeTypes: Record<string, never>;
  };
}

export type Post = {
  id: string;
  title: string;
  body: string;
  author_id: string | null;
  category_id: string | null;
  source: "user" | "scraped";
  source_url: string | null;
  status: "approved" | "pending" | "rejected" | "deleted";
  content_type?: string | null;
  is_pinned?: boolean | null;
  is_draft?: boolean | null;
  vote_score: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type PostWithRelations = Post & {
  profiles: { username: string; avatar_url?: string | null } | null;
  categories: { name: string; slug: string } | null;
  post_tags: { car_tags: { name: string; slug: string } }[];
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string | null;
  parent_id: string | null;
  body: string;
  vote_score: number;
  created_at: string;
};

export type CommentWithAuthor = Comment & {
  profiles: { username: string; avatar_url?: string | null } | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string;
};

export type CarTag = {
  id: string;
  name: string;
  slug: string;
};

export type Vote = {
  id: string;
  user_id: string;
  target_type: "post" | "comment";
  target_id: string;
  direction: "up" | "down";
};

export type Bookmark = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export type CommentWithPost = CommentWithAuthor & {
  posts: { id: string; title: string } | null;
};
