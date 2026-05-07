# AutOwner MVP Design Spec

**Date**: 2026-05-05
**Status**: Approved
**Domain**: www.autowner.com

## Overview

AutOwner is a car aftermarket forum targeting European and American car owners. Users discover solutions for maintenance, repair, modification, and other post-purchase needs through community posts. MVP focuses on a functional forum with automated content aggregation.

## Target Audience

Car owners in Europe and North America looking for DIY guides, repair advice, modification inspiration, and maintenance tips.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | SSR for SEO, search-ad landing pages need fast indexing |
| Database & Auth | Supabase (Postgres + Auth) | Managed Postgres, built-in email auth, real-time subscriptions |
| Styling | Tailwind CSS | Utility-first, fast iteration, responsive |
| Hosting | Vercel | Zero-config Next.js deployment, edge caching |

## MVP Features

### 1. Forum Homepage (Information Feed Layout)

- Top navbar: logo, search bar, "New Post" button, user avatar/dropdown
- Left sidebar: fixed category navigation
  - Categories: Maintenance, Repair, Mods & Tuning, Detailing, Buying Advice, DIY Guides
- Main feed: post cards with title, car model tag, category, reply count, vote count, timestamp
- Sort toggle: Hot / New
- Inspired by Reddit's content-first approach — optimized for content discovery and ad landing

### 2. Post Detail Page

- Full post content with author, timestamp, car model tags
- Comment/reply thread (flat list in v1)
- Vote buttons (upvote/downvote per post and per comment)
- Bookmark button
- Right sidebar: related posts by same category or car model tag
- Optimized as search-ad landing page: clean layout, high content density, related content to reduce bounce

### 3. Post Creation

- Title, body (rich text or markdown), category selector, car model tag input
- Anonymous/guest posts: NOT supported — requires user account for quality control

### 4. User System (Minimal)

- Email + password registration and login via Supabase Auth
- No social login in v1
- User profile: username, join date, post/comment count
- Bookmarks and votes tied to user ID

### 5. Content Automation Engine

- Background job that scrapes car forums, communities, and content sites
- Targets: English-language car aftermarket content (Reddit r/cars, r/mechanicadvice, car forums, DIY blogs)
- Processing pipeline: scrape → deduplicate → format → queue for review
- Auto-formatted into post structure (title, body, category, tags)
- All ingested content enters review queue; v1 defaults to auto-approve

### 6. Admin Dashboard

- Content review: view scraped posts, approve/reject
- Post management: edit, publish, unpublish
- Category and tag management
- v1 minimal — can be a simple Supabase row-level UI or a basic Next.js page

## Data Model (Core Tables)

```
users
  - id (uuid, PK)
  - email (text, unique)
  - username (text)
  - created_at (timestamp)

categories
  - id (uuid, PK)
  - name (text)
  - slug (text, unique)
  - description (text)

posts
  - id (uuid, PK)
  - title (text)
  - body (text)
  - author_id (uuid, FK → users)
  - category_id (uuid, FK → categories)
  - source (enum: user | scraped)
  - source_url (text, nullable)
  - status (enum: approved | pending | rejected)
  - vote_score (integer, default 0)
  - created_at (timestamp)
  - updated_at (timestamp)

car_tags
  - id (uuid, PK)
  - name (text) — e.g. "BMW M3", "Toyota Camry"
  - slug (text, unique)

post_tags
  - post_id (uuid, FK → posts)
  - tag_id (uuid, FK → car_tags)

comments
  - id (uuid, PK)
  - post_id (uuid, FK → posts)
  - author_id (uuid, FK → users)
  - body (text)
  - parent_id (uuid, FK → comments, nullable)
  - vote_score (integer, default 0)
  - created_at (timestamp)

votes
  - id (uuid, PK)
  - user_id (uuid, FK → users)
  - target_type (enum: post | comment)
  - target_id (uuid)
  - direction (enum: up | down)
  - UNIQUE(user_id, target_type, target_id)

bookmarks
  - id (uuid, PK)
  - user_id (uuid, FK → users)
  - post_id (uuid, FK → posts)
  - created_at (timestamp)
  - UNIQUE(user_id, post_id)
```

## Key Design Decisions

- **No anonymous posting**: even v1 requires registration, to prevent spam and maintain content quality
- **Scraped content is marked**: source field distinguishes user-generated from automated content
- **Vote score denormalized**: stored on posts/comments directly to avoid count queries on every render
- **Flat comments for v1**: nested threading deferred to later iterations

## Out of Scope (v1)

- Social login (Google, Apple, etc.)
- Rich text WYSIWYG editor (markdown input is sufficient)
- Direct messaging between users
- Notification system
- Membership tiers and monetization
- Basic search: use Postgres ILIKE for title/body matching in v1 (full-text search with tsvector deferred)
- Advanced SEO metadata (Open Graph, structured data — add before ad campaign launch)

## Monetization Roadmap (Post-MVP)

- Google AdSense / ad placements in post feed and detail pages
- Membership tier: members can embed affiliate product links in posts (Amazon, eBay, auto parts retailers)
- CPS tracking: auto-tag affiliate links with campaign parameters
