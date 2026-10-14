import { TypedSupabaseClient } from '@/utils/types';

export function getProjectsData(client: TypedSupabaseClient) {
  return client.from('projects').select().order('id', { ascending: true });
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
