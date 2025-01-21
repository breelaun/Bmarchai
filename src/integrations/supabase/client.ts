import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-client',
    },
  },
});

// Helper function for error handling
const handleSupabaseError = async (promise: Promise<any>) => {
  try {
    const response = await promise;
    if (response.error) {
      console.error('Supabase error:', response.error);
      throw response.error;
    }
    return response.data;
  } catch (error) {
    console.error('Operation failed:', error);
    throw error;
  }
};

// Export helper functions
export const supabaseHelper = {
  async getCurrentUser() {
    return handleSupabaseError(supabase.auth.getUser());
  },
  
  async getFavorites() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');
    
    return handleSupabaseError(
      supabase
        .from('stock_favorites')
        .select('*')
        .eq('user_id', user.id)
    );
  },
  
  async addFavorite(symbol: string, companyName: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');
    
    return handleSupabaseError(
      supabase
        .from('stock_favorites')
        .insert([{ user_id: user.id, symbol, company_name: companyName }])
        .select()
        .single()
    );
  },
  
  async removeFavorite(id: string) {
    return handleSupabaseError(
      supabase
        .from('stock_favorites')
        .delete()
        .eq('id', id)
    );
  }
};

// Optional: Export types if needed
export type SupabaseHelper = typeof supabaseHelper;
