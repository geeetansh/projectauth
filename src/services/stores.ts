import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface Store {
  id: string;
  shop_domain: string;
  access_token: string;
  scope: string;
  created_at: string;
  updated_at: string;
}

export const storeService = {
  async saveStore(shopDomain: string, accessToken: string, scope: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .upsert(
        {
          shop_domain: shopDomain,
          access_token: accessToken,
          scope: scope,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'shop_domain' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving store:', error);
      return null;
    }

    return data;
  },

  async getStore(shopDomain: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select()
      .eq('shop_domain', shopDomain)
      .single();

    if (error) {
      console.error('Error getting store:', error);
      return null;
    }

    return data;
  }
};