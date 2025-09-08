-- Create blog tables for SEO-optimized content management
-- Based on BLOG_IMPLEMENTATION_PLAN.md

-- Blog posts table with SEO fields
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL, -- Novel editor content (JSON format)
  content_html TEXT NOT NULL, -- Generated HTML for public display
  excerpt TEXT NOT NULL, -- Meta description
  meta_title TEXT, -- SEO title (different from display title)
  meta_description TEXT, -- Custom meta description
  featured_image_url TEXT,
  featured_image_alt TEXT, -- SEO alt text
  category TEXT NOT NULL, -- visa-guides, country-guides, document-guides, travel-tips
  target_keywords TEXT[], -- SEO keywords to target
  word_count INTEGER DEFAULT 0,
  readability_score DECIMAL(3,1), -- Flesch reading ease
  seo_score INTEGER DEFAULT 0, -- Overall SEO score (0-100)
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  schema_markup JSONB, -- Store structured data
  canonical_url TEXT, -- For SEO
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts(status);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);

-- SEO performance tracking
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_time_on_page INTEGER, -- seconds
  conversions INTEGER DEFAULT 0, -- leads generated
  search_queries TEXT[], -- What people searched to find this
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Related visa services linking
CREATE TABLE IF NOT EXISTS post_visa_links (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
  link_type TEXT CHECK (link_type IN ('mentioned', 'featured', 'recommended')),
  PRIMARY KEY (post_id, visa_type_id)
);

-- Disable RLS for now (can enable later with proper policies)
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_visa_links DISABLE ROW LEVEL SECURITY;