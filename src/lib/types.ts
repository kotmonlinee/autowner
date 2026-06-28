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
      diagnoses: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      error_logs: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      reports: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      vehicle_makes: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      vehicle_models: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      vehicle_generations: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      vehicle_engines: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      user_vehicles: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      post_vehicles: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      user_events: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      obd_codes: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
      repair_costs: { Row: TableRow; Insert: TableRow; Update: TableRow; Relationships: any[] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, any>;
    CompositeTypes: Record<string, never>;
  };
}

export type QuickAnswer = {
  most_likely_cause?: string;
  probability?: string;
  cost_min?: number;
  cost_max?: number;
  first_step?: string;
  next_steps?: string[];
};

export type Product = {
  name: string;
  description: string;
  price?: string;
  rating?: number;
  link?: string;
  imageUrl?: string;
};

export type Post = {
  id: string;
  slug?: string | null;
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
  quick_answer?: QuickAnswer | null;
  products?: Product[] | null;
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
  is_banned?: boolean | null;
  ban_reason?: string | null;
  banned_at?: string | null;
  last_active_at?: string | null;
  last_visited_at?: string | null;
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
  posts: { id: string; slug?: string | null; title: string } | null;
};

// ── Vehicle Database Types ──────────────────────────────────

export type VehicleMake = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  created_at: string;
};

export type VehicleModel = {
  id: string;
  make_id: string;
  name: string;
  slug: string;
};

export type VehicleGeneration = {
  id: string;
  model_id: string;
  name: string;
  year_start: number;
  year_end: number | null;
};

export type VehicleEngine = {
  id: string;
  generation_id: string;
  code: string;
  name: string;
  displacement: string | null;
  fuel_type: string | null;
  horsepower: number | null;
};

export type UserVehicle = {
  id: string;
  user_id: string;
  engine_id: string | null;
  year: number | null;
  nickname: string | null;
  is_primary: boolean;
  created_at: string;
};

export type UserVehicleWithDetails = UserVehicle & {
  vehicle_engines: VehicleEngine & {
    vehicle_generations: VehicleGeneration & {
      vehicle_models: VehicleModel & {
        vehicle_makes: VehicleMake;
      };
    };
  } | null;
};

export type PostVehicleLink = {
  post_id: string;
  engine_id: string;
};

// ── OBD Codes ──────────────────────────────────────────────

export type ObdCode = {
  code: string;
  title: string;
  severity: number;
  symptoms: string[];
  causes: string[];
  fixes: string[];
  fix_repair_slugs: (string | null)[];
  min_cost: number | null;
  max_cost: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export interface DiagnosticCause {
  keywords: string[];
  cause: string;
  probability: number;
  repairSlug: string | null;
  repairName: string | null;
  costRange: string | null;
  diyLevel: string | null;
  estTime: string | null;
  checks: { level: string; method: string; verdict: string }[];
}

// ── Repair Costs ───────────────────────────────────────────

export type RepairCostRow = {
  repair_slug: string;
  repair_name: string;
  make: string;
  model: string;
  tier: string;
  min_cost: number;
  max_cost: number;
  avg_cost: number;
  labor_cost: number;
  parts_cost: number;
  confidence_level: string;
};

export type RepairCostTier = {
  tier: string;
  tierLabel: string;
  vehicles: { make: string; model: string }[];
  min: number;
  max: number;
  avg: number;
  labor: number;
  parts: number;
  confidence: string;
};

export type RepairCostFull = {
  slug: string;
  name: string;
  tiers: Record<string, RepairCostTier>;
  overallMin: number;
  overallMax: number;
  overallAvg: number;
  confidence: string;
  created_at?: string | null;
  updated_at?: string | null;
};

// ── AI Diagnosis ─────────────────────────────────────────────

export type DiagnosisCause = {
  likelihood: string;
  description: string;
  verification_steps?: string[];
  repair_slug?: string | null;
};

export type DiagnosisJson = {
  title: string;
  causes: DiagnosisCause[];
  summary: string;
  severity: string;
  whatToDo: string;
  costEstimate: string;
  possibleCodes?: string[];
  repairKeywords?: string[];
  matchedRepairSlugs?: string[];
  faq?: { question: string; answer: string }[];
};

export type Diagnosis = {
  id: string;
  slug: string;
  symptom_path: string;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  diagnosis_json: DiagnosisJson;
  view_count: number;
  created_at: string;
  updated_at?: string | null;
};
