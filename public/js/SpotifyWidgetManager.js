import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class SpotifyWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("spotify-widget");
    this.apiUrl = "https://api.timfirst.com/api/github";
    this.defaultUpdateInterval = 60000
    this.notPlayingUpdateInterval = 300000;
    this.currentIntervalId = null;
    this.widgetUtil = new WidgetUtil(this.widgetElement);
    this.lastFetchTime = 0;
    this.cachedData = null;
  }

  async updateNowPlaying() {
    const now = Date.now();
    if (now - this.lastFetchTime < this.defaultUpdateInterval && this.cachedData) {
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
      this.adjustUpdateInterval(spotifyData.isPlaying);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      this.updateWidget(null);
      this.adjustUpdateInterval(false);
    }
  }

  updateWidget(data) {
    if (data && data.trackName !== "Not playing") {
      const status = data.isPlaying ? "LISTENING" : "LAST PLAYED";
      this.widgetUtil.updateWidget(status, data.trackName, data.artistName);
    } else {
      this.widgetUtil.updateWidget("NOT PLAYING", "", "");
    }
  }

  adjustUpdateInterval(isPlaying) {
    const newInterval = isPlaying ? this.defaultUpdateInterval : this.notPlayingUpdateInterval;
    if (this.currentIntervalId) {
      clearInterval(this.currentIntervalId);
    }
    this.currentIntervalId = setInterval(() => this.updateNowPlaying(), newInterval);
  }

  init() {
    this.updateNowPlaying();
    this.adjustUpdateInterval(false);
  }

}
