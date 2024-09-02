export async function onRequest(context) {
  const { GITHUB_KV } = context.env;

  try {
    const githubData = await GITHUB_KV.get('latestCommit');

    if (!githubData) {
      return new Response(JSON.stringify({ error: 'No commit data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const latestCommit = JSON.parse(githubData);

    return new Response(JSON.stringify(latestCommit), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });

  } catch (error) {
    console.error('Error fetching latest commit:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
