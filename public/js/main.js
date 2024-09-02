import { ShortcutsWidgetManager } from '/js/ShortcutsWidgetManager.js';
import { SpotifyWidgetManager } from '/js/SpotifyWidgetManager.js';
import { WeatherManager } from '/js/WeatherManager.js';
import { TimeWidgetManager } from '/js/TimeWidgetManager.js';
import { ConsoleTicksManager } from '/js/ConsoleTicksManager.js';
import { ReadingWidgetManager } from '/js/ReadingWidgetManager.js';
import { GithubWidgetManager } from '/js/GithubWidgetManager.js';

class App {
    constructor() {
        this.shortcutsWidgetManager = new ShortcutsWidgetManager();
        this.spotifyWidgetManager = new SpotifyWidgetManager();
        this.weatherManager = new WeatherManager();
        this.timeWidgetManager = new TimeWidgetManager();
        this.consoleTicksManager = new ConsoleTicksManager();
        this.readingWidgetManager = new ReadingWidgetManager();
        this.githubWidgetManager = new GithubWidgetManager();
    }

    init() {
        this.shortcutsWidgetManager.init();
        this.spotifyWidgetManager.init();
        this.weatherManager.init();
        this.timeWidgetManager.init();
        this.consoleTicksManager.init();
        this.readingWidgetManager.init();
        this.githubWidgetManager.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
