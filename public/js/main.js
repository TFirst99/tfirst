import { ShortcutsManager } from './ShortcutsManager,js';
import { SpotifyManager } from './SpotifyManager.js';
import { WeatherManager } from './WeatherManager.js';
import { TimeManager } from './TimeManager.js';
import { PromptManager } from './PromptManager.js';

class App {
    constructor() {
        this.shortcutsManager = new ShortcutsManager();
        this.spotifyManager = new SpotifyManager();
        this.weatherManager = new WeatherManager();
        this.timeManager = new TimeManager();
        this.promptManager = new PromptManager();
    }

    init() {
        this.shortcutsManager.init();
        this.spotifyManager.init();
        this.weatherManager.init();
        this.timeManager.init();
        this.promptManager.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});