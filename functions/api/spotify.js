export async function onRequest(context) {
  const spotifyData = await context.env.SPOTIFY_KV.get("current_track");

  if (!spotifyData) {
    return new Response(JSON.stringify({ error: "No data available" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(spotifyData, {
    headers: { "Content-Type": "application/json" },
  });
}
