-- ================================================
-- MuraAI Database Schema for Supabase
-- ================================================
-- Instructions: Copy and paste this into Supabase SQL Editor
-- Go to your Supabase Dashboard -> SQL Editor -> New Query
-- ================================================

-- Create heritage_items table
CREATE TABLE IF NOT EXISTS heritage_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('song', 'story', 'ritual', 'craft')),
    title TEXT NOT NULL,
    description TEXT,
    region TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('kazakh', 'russian')),
    audio_url TEXT,
    video_url TEXT,
    text_content TEXT,
    images TEXT[], -- Array of image URLs
    transcription TEXT,
    ai_analysis JSONB, -- JSON object with AI analysis results
    processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    tags TEXT[], -- Array of tags
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create analytics table (optional - for tracking)
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES heritage_items(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'view', 'share', 'download'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_heritage_items_type ON heritage_items(type);
CREATE INDEX IF NOT EXISTS idx_heritage_items_region ON heritage_items(region);
CREATE INDEX IF NOT EXISTS idx_heritage_items_status ON heritage_items(processing_status);
CREATE INDEX IF NOT EXISTS idx_heritage_items_created_at ON heritage_items(created_at DESC);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_heritage_items_search ON heritage_items
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(text_content, '')));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_heritage_items_updated_at ON heritage_items;
CREATE TRIGGER update_heritage_items_updated_at
    BEFORE UPDATE ON heritage_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Row Level Security (RLS) Policies
-- ================================================
-- Enable RLS
ALTER TABLE heritage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on heritage_items"
    ON heritage_items FOR SELECT
    USING (true);

-- Allow public insert (for hackathon - in production, add authentication)
CREATE POLICY "Allow public insert on heritage_items"
    ON heritage_items FOR INSERT
    WITH CHECK (true);

-- Allow public update (for hackathon - in production, add authentication)
CREATE POLICY "Allow public update on heritage_items"
    ON heritage_items FOR UPDATE
    USING (true);

-- Analytics policies
CREATE POLICY "Allow public read access on analytics"
    ON analytics FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert on analytics"
    ON analytics FOR INSERT
    WITH CHECK (true);

-- ================================================
-- Storage Setup Instructions
-- ================================================
-- After running this SQL:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Click "Create bucket"
-- 3. Bucket name: "heritage-files"
-- 4. Make it PUBLIC
-- 5. Set max file size: 100 MB
-- 6. Allowed MIME types: audio/*, video/*, image/*, text/*
-- ================================================

-- Verification query - run this to check if tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('heritage_items', 'analytics');
