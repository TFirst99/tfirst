export async function onRequest(context) {
  const { SPOTIFY_KV } = context.env;

  try {
    const spotifyData = await SPOTIFY_KV.get('current_track', 'json');
    if (spotifyData) {
      return new Response(JSON.stringify(spotifyData), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'No data available' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching Spotify data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}