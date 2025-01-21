import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const supabaseHelper = {
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  async getFavorites() {
    const { data, error } = await supabase
      .from('stock_favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  
  async addFavorite(symbol: string, companyName: string) {
    const { data, error } = await supabase
      .from('stock_favorites')
      .insert([{ symbol, company_name: companyName }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  async removeFavorite(id: string) {
    const { error } = await supabase
      .from('stock_favorites')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};