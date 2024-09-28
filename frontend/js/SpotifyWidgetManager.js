import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class SpotifyWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("spotify-widget");
    this.apiUrl = "https://api.timfirst.com/api/spotify";
    this.updateInterval = 60000;
    this.widgetUtil = new WidgetUtil(this.widgetElement);
    this.lastFetchTime = 0;
    this.cachedData = null;
    this.intervalId = null;
    this.paused = false;
  }

  async updateNowPlaying() {
    if (this.paused) return;

    const now = Date.now();
    if (now - this.lastFetchTime < this.updateInterval && this.cachedData) {
      this.updateWidget(this.cachedData);
      return;
    }
  
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch Spotify data");
      }
      const spotifyData = await response.json();
      this.cachedData = spotifyData;
      this.lastFetchTime = now;
      this.updateWidget(spotifyData);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data && data.trackName !== "Not playing") {
      const status = data.isPlaying ? "LISTENING" : "LAST PLAYED";
      this.widgetUtil.updateWidget(
        { content: status },
        { content: data.trackName },
        { content: data.artistName }
      );
    } else {
      this.widgetUtil.updateWidget(
        "NOT PLAYING",
        "",
        ""
      );
    }
  }

  pause() {
    this.paused = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume() {
    this.paused = false;
    if (!this.intervalId) {
      this.init();
    }
  }

  stop() {
    this.pause();
  }
  
  init() {
      this.updateNowPlaying();
      this.intervalId = setInterval(() => this.updateNowPlaying(), this.updateInterval);
    }
}
