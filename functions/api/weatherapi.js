export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const latitude = url.searchParams.get('latitude');
  const longitude = url.searchParams.get('longitude');

  if (!latitude || !longitude) {
    return new Response('Latitude and longitude are required', { status: 400 });
  }

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error fetching weather data', { status: 500 });
  }
}