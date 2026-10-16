import type { NextApiRequest, NextApiResponse } from 'next';
import { GITHUB_TOKEN } from '@/config/keys';
import { profile } from '@/data/profile';

// Latest merged PRs into repos I don't own, with line counts. The search API
// has no additions/deletions, so each PR's detail is fetched here once and
// cached at the edge, instead of every visitor's browser calling GitHub.
// Line counts cost one request per PR, so only the latest few get them; the
// organisation list comes from a wider search at no extra cost.
const LIMIT = 10;
const SEARCH_SIZE = 50;
const HOUR = 60 * 60;

const github = (url: string) =>
  fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {})
    }
  });

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const q = `author:${profile.github} type:pr is:merged -user:${profile.github}`;
  const search = await github(
    `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=updated&per_page=${SEARCH_SIZE}`
  );
  if (!search.ok) {
    return res.status(502).json({ error: `GitHub search ${search.status}` });
  }
  const data = await search.json();

  const items = await Promise.all(
    data.items.slice(0, LIMIT).map(async (i: any) => {
      const [owner, repo] = i.repository_url.split('/').slice(-2);
      // Line counts are a nice-to-have: a failed detail call drops them for
      // that row rather than failing the whole list.
      let additions: number | null = null;
      let deletions: number | null = null;
      const detail = await github(i.pull_request.url).catch(() => null);
      if (detail?.ok) {
        const pr = await detail.json();
        additions = pr.additions;
        deletions = pr.deletions;
      }
      return {
        title: i.title,
        url: i.html_url,
        owner,
        repo,
        closedAt: i.closed_at,
        additions,
        deletions
      };
    })
  );

  // Fresh for an hour, then served stale for up to a day while refreshing.
  // If any line counts are missing (usually GitHub's rate limit), cache
  // briefly instead, so the counts come back once the limit resets.
  const complete = items.every((i) => i.additions !== null);
  res.setHeader(
    'Cache-Control',
    complete
      ? `public, s-maxage=${HOUR}, stale-while-revalidate=${24 * HOUR}`
      : 'public, s-maxage=60'
  );
  // Every organisation contributed to, most recent first, each with the repo
  // I've merged the most PRs into there and that repo's star count (shown in
  // the avatar tooltips). One extra request per organisation.
  const prsPerRepo = new Map<string, number>();
  const ownerOrder: string[] = [];
  for (const i of data.items) {
    const [owner, repo] = i.repository_url.split('/').slice(-2);
    if (!ownerOrder.includes(owner)) ownerOrder.push(owner);
    const key = `${owner}/${repo}`;
    prsPerRepo.set(key, (prsPerRepo.get(key) ?? 0) + 1);
  }
  const owners = await Promise.all(
    ownerOrder.map(async (owner) => {
      // A repo picked in profile.featuredRepos wins; otherwise the one with
      // the most of my recent merged PRs in this organisation.
      const featured = profile.featuredRepos[owner];
      const topRepo = featured
        ? `${owner}/${featured}`
        : Array.from(prsPerRepo)
            .filter(([key]) => key.startsWith(`${owner}/`))
            .sort((a, b) => b[1] - a[1])[0][0];
      const repo = topRepo.split('/')[1];
      let stars: number | null = null;
      const info = await github(
        `https://api.github.com/repos/${topRepo}`
      ).catch(() => null);
      if (info?.ok) stars = (await info.json()).stargazers_count;
      return { owner, repo, stars };
    })
  );
  return res.status(200).json({ total: data.total_count, owners, items });
}
