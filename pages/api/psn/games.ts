import type { NextApiRequest, NextApiResponse } from 'next';
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  exchangeRefreshTokenForAuthTokens,
  getUserPlayedGames,
  type AuthTokensResponse
} from 'psn-api';
import { PSN_NPSSO } from '@/config/keys';

// Every PS4 and PS5 game I've played, most recent first: the "Playing now"
// tile shows the first three and its dialog lists them all. PSN only hands
// out tokens for an NPSSO cookie, so the exchange happens here on the server
// and the answer is cached at the edge for an hour.
const PAGE_SIZE = 100;
// A ceiling on pages, in case PSN keeps reporting more.
const MAX_GAMES = 500;
const HOUR = 60 * 60;

export interface PlayedGame {
  name: string;
  // Portrait key art for the tile's covers
  image: string;
  // The square store icon, for the dialog's rows
  icon: string;
  platform: 'PS5' | 'PS4' | null;
  lastPlayed: string;
  // Total time played, in minutes; null if PSN didn't report it.
  playMinutes: number | null;
}

// Kept between requests on a warm server: the access token lasts an hour and
// the refresh token about two months, so most requests skip the NPSSO
// exchange entirely.
let tokens: { auth: AuthTokensResponse; expiresAt: number } | null = null;

async function getAccessToken() {
  const now = Date.now();
  if (tokens && now < tokens.expiresAt) return tokens.auth.accessToken;

  let auth: AuthTokensResponse | null = null;
  if (tokens) {
    auth = await exchangeRefreshTokenForAuthTokens(
      tokens.auth.refreshToken
    ).catch(() => null);
  }
  if (!auth) {
    const code = await exchangeNpssoForAccessCode(PSN_NPSSO!);
    auth = await exchangeAccessCodeForAuthTokens(code);
  }
  // Renew a minute early so a token never expires mid-request.
  tokens = { auth, expiresAt: now + (auth.expiresIn - 60) * 1000 };
  return auth.accessToken;
}

// "EA SPORTS FC™ 26" reads better without the trademark marks, and the
// platform has its own label, so "(PlayStation®5)" goes too.
const cleanName = (name: string) =>
  name
    .replace(/[®™]/g, '')
    .replace(/\s*\(PlayStation\s*\d\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

// PSN reports play time as an ISO 8601 duration, e.g. "PT228H56M33S".
function toMinutes(duration?: string) {
  const m = duration?.match(
    /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:[\d.]+S)?$/
  );
  if (!m) return null;
  const [, d = '0', h = '0', min = '0'] = m;
  return (Number(d) * 24 + Number(h)) * 60 + Number(min);
}

const PLATFORMS: Record<string, PlayedGame['platform']> = {
  ps5_native_game: 'PS5',
  ps4_game: 'PS4'
};

// Portrait key art fits the 3:4 cover tiles; the square icon is the fallback.
const COVER_TYPES = ['PORTRAIT_BANNER', 'GAMEHUB_COVER_ART', 'MASTER'];

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (!PSN_NPSSO) {
    return res.status(503).json({ error: 'PSN_NPSSO is not set' });
  }

  try {
    const accessToken = await getAccessToken();
    const titles = [];
    for (let offset = 0; offset < MAX_GAMES; ) {
      const page = await getUserPlayedGames({ accessToken }, 'me', {
        limit: PAGE_SIZE,
        offset,
        categories: 'ps4_game,ps5_native_game'
      });
      titles.push(...page.titles);
      if (!page.nextOffset || page.nextOffset <= offset) break;
      offset = page.nextOffset;
    }

    const played: PlayedGame[] = titles.map((t) => {
      const images = t.concept?.media?.images ?? [];
      const cover = COVER_TYPES.map(
        (type) => images.find((i) => i.type === type)?.url
      ).find(Boolean);
      return {
        name: cleanName(t.localizedName || t.name),
        image: cover ?? t.localizedImageUrl ?? t.imageUrl,
        icon: t.localizedImageUrl || t.imageUrl,
        platform: PLATFORMS[t.category] ?? null,
        lastPlayed: t.lastPlayedDateTime,
        playMinutes: toMinutes(t.playDuration)
      };
    });

    // The same game can come back twice (one entry per region or edition of
    // a title): keep the most recent one and add up the time across both.
    const games: PlayedGame[] = [];
    const byKey = new Map<string, PlayedGame>();
    for (const game of played) {
      const key = `${game.name.toLowerCase()}|${game.platform}`;
      const seen = byKey.get(key);
      if (!seen) {
        byKey.set(key, game);
        games.push(game);
      } else if (game.playMinutes !== null) {
        seen.playMinutes = (seen.playMinutes ?? 0) + game.playMinutes;
      }
    }

    res.setHeader(
      'Cache-Control',
      `public, s-maxage=${HOUR}, stale-while-revalidate=${HOUR * 24}`
    );
    return res.status(200).json({ games });
  } catch (error) {
    // Usually an expired NPSSO: drop the cached tokens so the next request
    // tries again from scratch.
    tokens = null;
    return res
      .status(502)
      .json({ error: error instanceof Error ? error.message : 'PSN error' });
  }
}
