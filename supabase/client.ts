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

// Helper functions for diary
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function saveDiaryEntry(date: string, content: string) {
  const { user } = await getCurrentUser();
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('diary_entries')
    .upsert({
      user_id: user.id,
      date: date,
      content: content,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,date'
    });

  return { data, error };
}

export async function loadDiaryEntry(date: string) {
  const { user } = await getCurrentUser();
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('diary_entries')
    .select('content')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error && error.code === 'PGRST116') {
    // No entry found, return empty
    return { data: '', error: null };
  }

  return { data: data?.content || '', error };
}