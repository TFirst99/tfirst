export async function onRequest(context) {
  const { SPOTIFY_KV } = context.env;
  const cache = caches.default;

  let response = await cache.match(context.request);

  if (!response) {
    try {
      const spotifyData = await SPOTIFY_KV.get("current_track", "json");
      if (spotifyData) {
        response = new Response(JSON.stringify(spotifyData), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=55",
          },
        });
      } else {
        response = new Response(
          JSON.stringify({ error: "No data available" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      context.waitUntil(cache.put(context.request, response.clone()));
    } catch (error) {
      response = new Response(
        JSON.stringify({ error: "Error fetching Spotify data" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  return response;
}
