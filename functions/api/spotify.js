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
    return data.item ? formatTrackData(data.item, data.is_playing) : null;
  }

  async function getRecentlyPlayedTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      throw new Error(`Failed to get recently played track: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.items && data.items.length > 0 ? formatTrackData(data.items[0].track, false) : null;
  }

  function formatTrackData(item, isPlaying) {
    return {
      trackName: item.name,
      artistName: item.artists[0].name,
      albumName: item.album.name,
      albumArt: item.album.images[0].url,
      isPlaying: isPlaying
    };
  }

  try {
    const accessToken = await getAccessToken();
    let trackData = await getCurrentTrack(accessToken);
    
    if (!trackData) {
      trackData = await getRecentlyPlayedTrack(accessToken);
    }
    
    if (!trackData) {
      return new Response(JSON.stringify({ message: 'No track currently playing or recently played' }), {
        status: 204,
      });
    }
    
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