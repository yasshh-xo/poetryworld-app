import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Check if current user is admin
export const isAdmin = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.EXPO_PUBLIC_ADMIN_EMAIL;
  return user?.email === adminEmail;
};

// Database types
export interface Poem {
  id: string;
  title: string;
  content: string;
  author: string;
  category_id?: string;
  theme_id?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
}

export interface Comment {
  id: string;
  poem_id: string;
  user_id: string;
  content: string;
  created_at: string;
  approved: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface Bookmark {
  id: string;
  user_id: string;
  poem_id: string;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  poem_id: string;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  poem_ids: string[];
  created_at: string;
}
