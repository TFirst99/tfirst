import weatherArt from './weatherArt/index.js';

export class WeatherManager {
    constructor() {
        this.weatherElement = document.getElementById('weather-widget');
        this.weatherArtElement = document.getElementById('weather-art');
        this.currentWeatherType = 'clear';
        this.animationFrame = 0;
        this.weatherConditions = {
            0: 'clear',
            1: 'clouds', 2: 'clouds', 3: 'clouds',
            45: 'mist', 48: 'mist',
            51: 'drizzle', 53: 'drizzle', 55: 'drizzle',
            56: 'drizzle', 57: 'drizzle',
            61: 'rain', 63: 'rain', 65: 'rain',
            66: 'rain', 67: 'rain',
            71: 'snow', 73: 'snow', 75: 'snow',
            77: 'snow',
            80: 'rain', 81: 'rain', 82: 'rain',
            85: 'snow', 86: 'snow',
            95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm'
        };

        const currentYear = new Date().getFullYear().toString();
        this.weatherArt = weatherArt(currentYear);
    }

    init() {
        this.fetchWeather();
        this.startWeatherAnimation();
        setInterval(() => this.fetchWeather(), 300000);
    }

    async fetchWeather() {
        try {
            const cachedWeather = localStorage.getItem('cachedWeather');
            const cachedTime = localStorage.getItem('cachedWeatherTime');
            
            if (cachedWeather && cachedTime && (Date.now() - parseInt(cachedTime)) < 300000) {
                this.updateWeather(JSON.parse(cachedWeather));
                return;
            }

            const position = await this.getLocation();
            const { latitude, longitude } = position.coords;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

            const response = await fetch(url);
            const data = await response.json();
            
            localStorage.setItem('cachedWeather', JSON.stringify(data));
            localStorage.setItem('cachedWeatherTime', Date.now().toString());

            this.updateWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.weatherElement.innerHTML = this.createWeatherHTML('unknown', 'N/A');
            this.weatherArtElement.textContent = '';
        }
    }

    updateWeather(data) {
        const { temperature: temp, weathercode: weatherCode } = data.current_weather;
        this.currentWeatherType = this.weatherConditions[weatherCode] || 'clear';
        this.weatherElement.innerHTML = this.createWeatherHTML(this.currentWeatherType, temp);
    }

    createWeatherHTML(type, temp) {
        return `+-------------------+
|      WEATHER      |
|      ${this.padRight(type, 12)} |
|      ${this.padRight(temp + '°C', 12)} |
+-------------------+`;
    }

    startWeatherAnimation() {
        setInterval(() => this.updateWeatherAnimation(), 500);
    }

    updateWeatherAnimation() {
        const currentArt = this.weatherArt[this.currentWeatherType][this.animationFrame % this.weatherArt[this.currentWeatherType].length];
        this.weatherArtElement.textContent = currentArt;
        this.animationFrame++;
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }

    padRight(str, length, padChar = ' ') {
        return str + padChar.repeat(Math.max(0, length - str.length));
    }
}
