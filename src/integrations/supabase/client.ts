import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getFavorites() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');
  
  const { data, error } = await supabase
    .from('stock_favorites')
    .select('*')
    .eq('user_id', user.id);
    
  if (error) throw error;
  return data;
}

export async function addFavorite(symbol: string, companyName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');
  
  const { data, error } = await supabase
    .from('stock_favorites')
    .insert([{ user_id: user.id, symbol, company_name: companyName }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function removeFavorite(id: string) {
  const { error } = await supabase
    .from('stock_favorites')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
}
