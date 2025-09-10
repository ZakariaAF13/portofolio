import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      portfolio_settings: {
        Row: {
          id: string;
          hero_title: string;
          hero_subtitle: string;
          hero_image_url?: string;
          background_image_url?: string;
          profile_image_url?: string;
          meta_title: string;
          meta_description: string;
          og_image_url?: string;
          updated_at: string;
        };
        Insert: {
          hero_title: string;
          hero_subtitle: string;
          hero_image_url?: string;
          background_image_url?: string;
          profile_image_url?: string;
          meta_title: string;
          meta_description: string;
          og_image_url?: string;
        };
        Update: Partial<Database['public']['Tables']['portfolio_settings']['Insert']>;
      };
      sections: {
        Row: {
          id: string;
          key: string;
          title: string;
          content: string;
          order_index: number;
          is_visible: boolean;
          updated_at: string;
        };
        Insert: {
          key: string;
          title: string;
          content: string;
          order_index: number;
          is_visible?: boolean;
        };
        Update: Partial<Database['public']['Tables']['sections']['Insert']>;
      };
      contact_info: {
        Row: {
          id: string;
          email: string;
          phone?: string;
          location?: string;
          linkedin_url?: string;
          github_url?: string;
          twitter_url?: string;
          website_url?: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          phone?: string;
          location?: string;
          linkedin_url?: string;
          github_url?: string;
          twitter_url?: string;
          website_url?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_info']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url?: string;
          demo_url?: string;
          github_url?: string;
          technologies: string[];
          is_featured: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          image_url?: string;
          demo_url?: string;
          github_url?: string;
          technologies: string[];
          is_featured?: boolean;
          order_index: number;
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
    };
  };
};