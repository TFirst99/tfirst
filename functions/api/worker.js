export default {
  async scheduled(event, env, ctx) {
    console.log("Scheduled worker ran at", event.scheduledTime);
    await updateSpotifyData(env);
  },

  async fetch(request, env, ctx) {
    return await getStoredSpotifyData(env);
  },
};

async function updateSpotifyData(env) {
  const spotifyData = await fetchSpotifyData(env);
  await env.SPOTIFY_KV.put("current_track", JSON.stringify(spotifyData));
}

async function getStoredSpotifyData(env) {
  const storedData = await env.SPOTIFY_KV.get("current_track");
  if (!storedData) {
    return new Response(JSON.stringify({ error: "No data available" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(storedData, {
    headers: { "Content-Type": "application/json" },
  });
}

async function fetchSpotifyData(env) {
  const accessToken = await getAccessToken(env);
  const currentlyPlayingData = await getCurrentlyPlaying(accessToken);

  if (currentlyPlayingData && currentlyPlayingData.is_playing) {
    return formatTrackData(currentlyPlayingData.item, true);
  } else {
    const recentTrackData = await getRecentlyPlayedTrack(accessToken);
    return recentTrackData
      ? formatTrackData(recentTrackData, false)
      : { trackName: "Not playing", artistName: "No artist", isPlaying: false };
  }
}

async function getAccessToken(env) {
  const SPOTIFY_REFRESH_TOKEN = await env.SPOTIFY_KV.get("REFRESH_TOKEN");

  if (!SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Refresh token not set");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get access token: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (data.refresh_token) {
    await env.SPOTIFY_KV.put("REFRESH_TOKEN", data.refresh_token);
  }

  return data.access_token;
}

async function getCurrentlyPlaying(accessToken) {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to get current track: ${response.status} ${response.statusText}`,
    );
  }
  return await response.json();
}

async function getRecentlyPlayedTrack(accessToken) {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to get recently played track: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  return data.items && data.items.length > 0 ? data.items[0].track : null;
}

function formatTrackData(item, isPlaying) {
  return {
    trackName: item.name,
    artistName: item.artists[0].name,
    albumName: item.album.name,
    albumArt: item.album.images[0].url,
    isPlaying: isPlaying,
  };
}
