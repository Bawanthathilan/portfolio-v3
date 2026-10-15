import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/utils/database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

export interface Project {
  id: number;
  name: string;
  desc: string;
  img: string | null;
  web: string | null;
  github: string | null;
  category: string;
  tech: string[];
}
