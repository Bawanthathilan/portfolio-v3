import type { NextApiRequest, NextApiResponse } from 'next';
import getNowPlayingItem from '@/utils/spotify';
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN
} from '@/config/keys';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getNowPlayingItem(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET,
      SPOTIFY_REFRESH_TOKEN
    );

    if (!data) {
      return res.status(200).json({ isPlaying: false });
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=59'
    );
    return res.status(200).json(data);
  } catch {
    return res.status(200).json({ isPlaying: false });
  }
}
