let SPOTIFY_REFRESH_TOKEN;

export async function onRequest(context) {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = context.env;
  SPOTIFY_REFRESH_TOKEN = await context.env.SPOTIFY_KV.get("REFRESH_TOKEN");

  if (!SPOTIFY_REFRESH_TOKEN) {
    return new Response("Refresh token not set", { status: 500 });
  }

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

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.refresh_token) {
      SPOTIFY_REFRESH_TOKEN = data.refresh_token;
      await context.env.SPOTIFY_KV.put("REFRESH_TOKEN", SPOTIFY_REFRESH_TOKEN);
    }
    
    return data.access_token;
  }

  async function getCurrentTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to get current track: ${response.status} ${response.statusText}`);
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
    
    return new Response(JSON.stringify(trackData), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}