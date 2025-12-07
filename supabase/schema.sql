-- PoetryWorld Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Themes table
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Poems table
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  theme_id UUID REFERENCES themes(id),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0
);

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  poem_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Categories: Everyone can read, only admin can write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only admin can insert categories" ON categories
  FOR INSERT WITH CHECK (auth.email() = 'your-admin-email@example.com');

CREATE POLICY "Only admin can update categories" ON categories
  FOR UPDATE USING (auth.email() = 'your-admin-email@example.com');

CREATE POLICY "Only admin can delete categories" ON categories
  FOR DELETE USING (auth.email() = 'your-admin-email@example.com');

-- Themes: Everyone can read, only admin can write
CREATE POLICY "Themes are viewable by everyone" ON themes
  FOR SELECT USING (true);

CREATE POLICY "Only admin can insert themes" ON themes
  FOR INSERT WITH CHECK (auth.email() = 'your-admin-email@example.com');

CREATE POLICY "Only admin can update themes" ON themes
  FOR UPDATE USING (auth.email() = 'your-admin-email@example.com');

CREATE POLICY "Only admin can delete themes" ON themes
  FOR DELETE USING (auth.email() = 'your-admin-email@example.com');

-- Poems: Everyone can read, only admin can write
CREATE POLICY "Poems are viewable by everyone" ON poems
  FOR SELECT USING (true);

CREATE POLICY "Only admin can insert poems" ON poems
  FOR INSERT WITH CHECK (auth.email() = 'your-admin-email@example.com');

CREATE POLICY "Only admin can update poems" ON poems
  FOR UPDATE USING (auth.email() = 'your-admin-email@example.com');

CREATE POLICY "Only admin can delete poems" ON poems
  FOR DELETE USING (auth.email() = 'your-admin-email@example.com');

-- User profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Likes: Users can read all, manage own
CREATE POLICY "Likes are viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks: Users can read own, manage own
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Comments: Everyone can read approved, users can insert, admin can approve
CREATE POLICY "Approved comments are viewable by everyone" ON comments
  FOR SELECT USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admin can update comments" ON comments
  FOR UPDATE USING (auth.email() = 'your-admin-email@example.com');

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Collections: Users can read own, manage own
CREATE POLICY "Users can view own collections" ON collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collections" ON collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections" ON collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections" ON collections
  FOR DELETE USING (auth.uid() = user_id);

-- Functions to update counters
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poems SET likes_count = likes_count + 1 WHERE id = NEW.poem_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poems SET likes_count = likes_count - 1 WHERE id = OLD.poem_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poems SET comments_count = comments_count + 1 WHERE id = NEW.poem_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poems SET comments_count = comments_count - 1 WHERE id = OLD.poem_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION increment_likes_count();

CREATE TRIGGER on_like_deleted
  AFTER DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION decrement_likes_count();

CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION increment_comments_count();

CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION decrement_comments_count();

-- Insert sample data
INSERT INTO categories (name, description, icon, color) VALUES
  ('Love', 'Poems about love and romance', '❤️', '#e94560'),
  ('Nature', 'Poems celebrating the natural world', '🌿', '#16a085'),
  ('Life', 'Reflections on life and existence', '🌟', '#f39c12'),
  ('Hope', 'Poems of hope and inspiration', '✨', '#3498db'),
  ('Sadness', 'Melancholic and emotional poems', '💔', '#9b59b6');

INSERT INTO themes (name, description) VALUES
  ('Romantic', 'Themes of love and passion'),
  ('Philosophical', 'Deep thoughts and reflections'),
  ('Inspirational', 'Uplifting and motivating'),
  ('Melancholic', 'Sad and reflective'),
  ('Celebratory', 'Joyful and festive');

-- Sample poem
INSERT INTO poems (title, content, author, tags) VALUES
  ('The Road Not Taken', 
   E'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;',
   'Robert Frost',
   ARRAY['classic', 'life', 'choices']);
