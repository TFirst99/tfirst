import { SpotifyWidgetManager } from '/js/SpotifyWidgetManager.js';
import { WeatherManager } from '/js/WeatherManager.js';
import { TimeWidgetManager } from '/js/TimeWidgetManager.js';
import { ReadingWidgetManager } from '/js/ReadingWidgetManager.js';
import { GithubWidgetManager } from '/js/GithubWidgetManager.js';
import { AboutWidgetManager } from '/js/AboutWidgetManager.js';
import { ServerWidgetManager } from '/js/ServerWidgetManager.js';
import { TitleWidgetManager } from '/js/TitleWidgetManager.js';

class App {
    constructor() {
        this.spotifyWidgetManager = new SpotifyWidgetManager();
        this.weatherManager = new WeatherManager();
        this.timeWidgetManager = new TimeWidgetManager();
        this.readingWidgetManager = new ReadingWidgetManager();
        this.githubWidgetManager = new GithubWidgetManager();
        this.aboutWidgetManager = new AboutWidgetManager();
        this.serverWidgetManager = new ServerWidgetManager();
        this.titleWidgetManager = new TitleWidgetManager();
    }

    init() {
        this.spotifyWidgetManager.init();
        this.weatherManager.init();
        this.timeWidgetManager.init();
        this.readingWidgetManager.init();
        this.githubWidgetManager.init();
        this.aboutWidgetManager.init();
        this.serverWidgetManager.init();
        this.titleWidgetManager.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
