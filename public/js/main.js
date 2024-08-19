import { ShortcutsWidgetManager } from './ShortcutsWidgetManager.js';
import { SpotifyWidgetManager } from './SpotifyWidgetManager.js';
import { WeatherManager } from './WeatherManager.js';
import { TimeWidgetManager } from './TimeWidgetManager.js';
import { ConsoleTicksManager } from './ConsoleTicksManager.js';

class App {
    constructor() {
        this.shortcutsWidgetManager = new ShortcutsWidgetManager();
        this.spotifyWidgetManager = new SpotifyWidgetManager();
        this.weatherManager = new WeatherManager();
        this.timeWidgetManager = new TimeWidgetManager();
        this.consoleTicksManager = new ConsoleTicksManager();
    }

    init() {
        this.shortcutsWidgetManager.init();
        this.spotifyWidgetManager.init();
        this.weatherManager.init();
        this.timeWidgetManager.init();
        this.consoleTicksManager.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});