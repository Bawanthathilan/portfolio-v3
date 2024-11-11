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
