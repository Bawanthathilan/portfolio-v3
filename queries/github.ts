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

// Merged PRs into repositories I don't own.
export function useMergedPrs() {
  return useQuery<{ total: number; items: MergedPr[] }>({
    queryKey: ['gh-merged-prs'],
    staleTime: HOUR,
    queryFn: async () => {
      const q = `author:${profile.github} type:pr is:merged -user:${profile.github}`;
      const res = await fetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=updated&per_page=50`
      );
      if (!res.ok) throw new Error('merged prs');
      const data = await res.json();
      return {
        total: data.total_count,
        items: data.items.map((i: any) => {
          const [owner, repo] = i.repository_url.split('/').slice(-2);
          return {
            title: i.title,
            url: i.html_url,
            owner,
            repo,
            closedAt: i.closed_at
          };
        })
      };
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
