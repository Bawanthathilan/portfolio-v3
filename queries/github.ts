import { useQuery } from '@tanstack/react-query';
import { profile } from '@/data/profile';

const HOUR = 1000 * 60 * 60;

export interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface MergedPr {
  title: string;
  url: string;
  repo: string;
  owner: string;
  closedAt: string;
  additions: number | null;
  deletions: number | null;
}

export interface GithubUser {
  public_repos: number;
  followers: number;
}

export function useGithubUser() {
  return useQuery<GithubUser>({
    queryKey: ['gh-user'],
    staleTime: HOUR,
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/users/${profile.github}`);
      if (!res.ok) throw new Error('github user');
      return res.json();
    }
  });
}

export function useContributions() {
  return useQuery<{ total: number; days: Contribution[] }>({
    queryKey: ['gh-contributions'],
    staleTime: HOUR,
    queryFn: async () => {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${profile.github}?y=last`
      );
      if (!res.ok) throw new Error('contributions');
      const data = await res.json();
      return { total: data.total.lastYear, days: data.contributions };
    }
  });
}

// Latest merged PRs into repos I don't own, with line counts. Served by
// /api/github/prs, which fetches the per-PR detail once and caches it.
export function useMergedPrs() {
  return useQuery<{ total: number; owners: string[]; items: MergedPr[] }>({
    queryKey: ['gh-merged-prs'],
    staleTime: HOUR,
    queryFn: async () => {
      const res = await fetch('/api/github/prs');
      if (!res.ok) throw new Error('merged prs');
      return res.json();
    }
  });
}

export function useRepoStars(githubUrl: string | null) {
  const slug = githubUrl?.match(/github\.com\/([^/]+\/[^/#?]+)/)?.[1];
  return useQuery<number>({
    queryKey: ['gh-stars', slug],
    enabled: !!slug,
    staleTime: HOUR,
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/repos/${slug}`);
      if (!res.ok) throw new Error('stars');
      return (await res.json()).stargazers_count;
    }
  });
}
