import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getFavorites = async () => {
  const { data, error } = await supabase
    .from('stock_favorites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addFavorite = async (symbol: string, companyName: string) => {
  const { data, error } = await supabase
    .from('stock_favorites')
    .insert([{ symbol, company_name: companyName }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFavorite = async (id: string) => {
  const { error } = await supabase
    .from('stock_favorites')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};