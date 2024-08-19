export async function onRequest(context) {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = context.env;

  async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN
      })
    });
    const data = await response.json();
    return data.access_token;
  }

  async function getCurrentTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (response.status === 204) {
      return null;
    }
    const data = await response.json();
    return data.item ? {
      trackName: data.item.name,
      artistName: data.item.artists[0].name,
      albumName: data.item.album.name,
      albumArt: data.item.album.images[0].url,
      isPlaying: data.is_playing
    } : null;
  }

  try {
    const accessToken = await getAccessToken();
    const trackData = await getCurrentTrack(accessToken);
    if (trackData) {
      return new Response(JSON.stringify(trackData), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ message: 'No track currently playing' }), {
        status: 204,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred while fetching data from Spotify' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}