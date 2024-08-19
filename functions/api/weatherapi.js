export async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const response = await fetch(url);
  const data = await response.json();

  const { temperature, weathercode } = data.current_weather;
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

  const weatherType = weatherConditions[weathercode] || 'clear';

  const now = new Date();
  const yearString = now.toLocaleDateString('en-US', {year: 'numeric'});

  return {
    temperature,
    weatherType,
    yearString
  };
}