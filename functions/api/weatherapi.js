export async function onRequestGet(context) {
    const url = new URL(context.request.url);
    const latitude = url.searchParams.get('lat') || '40.7128'; // Default to New York
    const longitude = url.searchParams.get('lon') || '-74.0060';

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const weatherConditions = {
            0: 'clear', 1: 'clouds', 2: 'clouds', 3: 'clouds',
            45: 'mist', 48: 'mist',
            51: 'drizzle', 53: 'drizzle', 55: 'drizzle', 56: 'drizzle', 57: 'drizzle',
            61: 'rain', 63: 'rain', 65: 'rain', 66: 'rain', 67: 'rain',
            71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow',
            80: 'rain', 81: 'rain', 82: 'rain',
            85: 'snow', 86: 'snow',
            95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm'
        };

        const { temperature, weathercode } = data.current_weather;
        const weatherType = weatherConditions[weathercode] || 'clear';

        return new Response(JSON.stringify({ temperature, weatherType }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch weather data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}