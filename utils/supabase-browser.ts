import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/utils/database.types';
import type { TypedSupabaseClient } from '@/utils/types';
import { useMemo } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/keys';

let client: TypedSupabaseClient | undefined;

function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);

  return client;
}

function useSupabaseBrowser() {
  return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseBrowser;
