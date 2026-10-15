import { TypedSupabaseClient } from '@/utils/types';

export function getProjectsData(client: TypedSupabaseClient) {
  // Only projects switched on in the `display` column, newest first.
  return client
    .from('projects')
    .select()
    .eq('display', true)
    .order('id', { ascending: false });
}

export function getAchievementsData(client: TypedSupabaseClient) {
  return client.from('achivements').select().order('id', { ascending: true });
}

export function getWorkData(client: TypedSupabaseClient) {
  return client.from('work').select().order('position', { ascending: true });
}

export function getGuestbookData(client: TypedSupabaseClient) {
  return client
    .from('guestbook')
    .select('id, username, message, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5);
}

export function getCertificationsData(client: TypedSupabaseClient) {
  return client
    .from('certifications')
    .select()
    .eq('display', true)
    .order('position', { ascending: true });
}
