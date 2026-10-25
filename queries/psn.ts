import { useQuery } from '@tanstack/react-query';
import type { PlayedGame } from '@/pages/api/psn/games';

const HOUR = 1000 * 60 * 60;

export function usePlayedGames() {
  return useQuery<PlayedGame[]>({
    queryKey: ['psn-played-games'],
    staleTime: HOUR,
    // No NPSSO, or it expired: keep the hardcoded list instead of retrying.
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/psn/games');
      if (!res.ok) throw new Error('psn games');
      return (await res.json()).games;
    }
  });
}
