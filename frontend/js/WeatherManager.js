import weatherArt from '/js/weatherArt/index.js';

export class WeatherManager {
    constructor() {
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
        this.fetchIntervalId = null;
        this.animationIntervalId = null;
        this.paused = false;
    }

    async fetchWeather() {
        if (this.paused) return;

        try {
            const position = await this.getLocation();
            const { latitude, longitude } = position.coords;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

            const response = await fetch(url);
            const data = await response.json();

            this.updateWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.updateWeather({ current_weather: { weathercode: 'unknown' } });
        }
    }

    updateWeather(data) {
        const { weathercode: weatherCode } = data.current_weather;
        this.currentWeatherType = this.weatherConditions[weatherCode] || 'clear';
    }

    startWeatherAnimation() {
        this.animationIntervalId = setInterval(() => this.updateWeatherAnimation(), 500);
    }

    updateWeatherAnimation() {
        if (this.paused) return;

        const currentArt = this.weatherArt[this.currentWeatherType][this.animationFrame % this.weatherArt[this.currentWeatherType].length];
        this.weatherArtElement.textContent = currentArt;
        this.animationFrame++;
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject(new Error("geolocation is not supported by this browser."));
            }
        });
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        if (!this.fetchIntervalId || !this.animationIntervalId) {
            this.init();
        }
    }

    stop() {
        this.pause();
        if (this.fetchIntervalId) {
            clearInterval(this.fetchIntervalId);
            this.fetchIntervalId = null;
        }
        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }
    }
    
    init() {
        this.fetchWeather();
        this.startWeatherAnimation();
        this.fetchIntervalId = setInterval(() => this.fetchWeather(), 300000);
    }
}
