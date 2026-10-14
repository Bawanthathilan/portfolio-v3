import querystring from 'querystring';
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN
} from '@/config/keys';

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const client_id = SPOTIFY_CLIENT_ID;
const client_secret = SPOTIFY_CLIENT_SECRET;
const refresh_token = SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token
    })
  });

  return response.json();
};

export const getNowPlaying = async (
  client_id,
  client_secret,
  refresh_token
) => {
  const { access_token } = await getAccessToken(
    client_id,
    client_secret,
    refresh_token
  );

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
};

const toTrack = (item) => ({
  albumImageUrl: item.album.images[0]?.url,
  artist: item.artists.map((_artist) => _artist.name).join(', '),
  songUrl: item.external_urls.spotify,
  title: item.name
});

// Falls back to the last played track when nothing is playing. That needs the
// `user-read-recently-played` scope on the refresh token; without it Spotify
// answers 401/403 and we just report "not playing".
async function getRecentlyPlayed(access_token) {
  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  if (!response.ok) return false;
  const { items } = await response.json();
  if (!items?.length) return false;
  return {
    ...toTrack(items[0].track),
    isPlaying: false,
    playedAt: items[0].played_at
  };
}

export default async function getNowPlayingItem(
  client_id,
  client_secret,
  refresh_token
) {
  const { access_token } = await getAccessToken(
    client_id,
    client_secret,
    refresh_token
  );

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  if (response.status === 200) {
    const song = await response.json();
    // `item` is null for ads and some podcasts
    if (song.item) return { ...toTrack(song.item), isPlaying: song.is_playing };
  }

  return getRecentlyPlayed(access_token);
}
