import { createClient } from '@supabase/supabase-js';

// ---- Types matching the database schema ----

export interface Profile {
  id: string;
  name: string;
  avatar: string; // hex color or emoji identifier
  created_at?: string;
}

export interface LessonProgress {
  id?: string;
  profile_id: string;
  lesson_id: string;
  completed: boolean;
  updated_at?: string;
}

export interface MentorMessage {
  id?: string;
  profile_id: string;
  role: string; // 'user' | 'assistant'
  content: string;
  created_at?: string;
}

// ---- Safe Supabase client initialization ----

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function createSafeClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[SantiSOFT] Variaveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY nao definidas. ' +
      'A sincronizacao em nuvem ficara desativada — o app usara apenas localStorage.'
    );
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.warn('[SantiSOFT] Erro ao inicializar Supabase client:', err);
    return null;
  }
}

export const supabase = createSafeClient();

// Helper flag for components to check sync availability
export const isSupabaseAvailable = supabase !== null;
