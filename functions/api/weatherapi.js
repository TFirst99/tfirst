export async function onRequestGet(context) {
  try {
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

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&timezone=auto`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const restructuredData = {
      current_weather: {
        temperature: data.current.temperature_2m,
        weathercode: data.current.weathercode
      }
    };

    return new Response(JSON.stringify(restructuredData), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching weather data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}