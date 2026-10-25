import type { NextApiRequest, NextApiResponse } from 'next';
import {
  exchangeAccessCodeForAuthTokens,
  exchangeNpssoForAccessCode,
  exchangeRefreshTokenForAuthTokens,
  getUserPlayedGames,
  type AuthTokensResponse
} from 'psn-api';
import { PSN_NPSSO } from '@/config/keys';

// My most recently played PlayStation games, for the "Playing now" tile.
// PSN only hands out tokens for an NPSSO cookie, so the exchange happens here
// on the server and the answer is cached at the edge for an hour.
const LIMIT = 3;
const HOUR = 60 * 60;

export interface PlayedGame {
  name: string;
  image: string;
  lastPlayed: string;
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

// "EA SPORTS FC™ 26" reads better without the trademark marks.
const cleanName = (name: string) =>
  name
    .replace(/[®™]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

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
    const { titles } = await getUserPlayedGames({ accessToken }, 'me', {
      limit: LIMIT,
      offset: 0,
      categories: 'ps4_game,ps5_native_game'
    });

    const games: PlayedGame[] = titles.map((t) => {
      const images = t.concept?.media?.images ?? [];
      const cover = COVER_TYPES.map(
        (type) => images.find((i) => i.type === type)?.url
      ).find(Boolean);
      return {
        name: cleanName(t.localizedName || t.name),
        image: cover ?? t.localizedImageUrl ?? t.imageUrl,
        lastPlayed: t.lastPlayedDateTime
      };
    });

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
