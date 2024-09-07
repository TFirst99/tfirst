import { ShortcutsWidgetManager } from '/js/ShortcutsWidgetManager.js';
import { SpotifyWidgetManager } from '/js/SpotifyWidgetManager.js';
import { WeatherManager } from '/js/WeatherManager.js';
import { TimeWidgetManager } from '/js/TimeWidgetManager.js';
import { ConsoleTicksManager } from '/js/ConsoleTicksManager.js';
import { ReadingWidgetManager } from '/js/ReadingWidgetManager.js';
import { GithubWidgetManager } from '/js/GithubWidgetManager.js';
import { AboutWidgetManager } from '/js/AboutWidgetManager.js';
import { ServerWidgetManager } from './ServerWidgetManager.js';

class App {
    constructor() {
        this.shortcutsWidgetManager = new ShortcutsWidgetManager();
        this.spotifyWidgetManager = new SpotifyWidgetManager();
        this.weatherManager = new WeatherManager();
        this.timeWidgetManager = new TimeWidgetManager();
        this.consoleTicksManager = new ConsoleTicksManager();
        this.readingWidgetManager = new ReadingWidgetManager();
        this.githubWidgetManager = new GithubWidgetManager();
        this.aboutWidgetManager = new AboutWidgetManager();
        this.serverWidgetManager = new ServerWidgetManager();
    }

    init() {
        this.shortcutsWidgetManager.init();
        this.spotifyWidgetManager.init();
        this.weatherManager.init();
        this.timeWidgetManager.init();
        this.consoleTicksManager.init();
        this.readingWidgetManager.init();
        this.githubWidgetManager.init();
        this.aboutWidgetManager.init();
        this.serverWidgetManager.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
