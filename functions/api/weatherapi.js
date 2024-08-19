export async function onRequest(context) {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return new Response(JSON.stringify({ error: 'Latitude and longitude are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching weather data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}