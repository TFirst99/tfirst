export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const latitude = url.searchParams.get('latitude');
  const longitude = url.searchParams.get('longitude');

  if (!latitude || !longitude) {
    return new Response(JSON.stringify({ error: 'Latitude and longitude are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await fetch(openMeteoUrl);
    
    if (!response.ok) {
      throw new Error(`OpenMeteo API responded with status ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return new Response(JSON.stringify({ error: 'Error fetching weather data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}