import { SpotifyManager } from './SpotifyManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const spotifyManager = new SpotifyManager();
    spotifyManager.init();
});