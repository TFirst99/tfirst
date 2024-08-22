export class SpotifyWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("spotify-widget");
    this.apiUrl = "/api/spotify";
    this.contentWidth = 19;
    this.scrollIntervals = [null, null];
    this.defaultUpdateInterval = 60000;
    this.notPlayingUpdateInterval = 300000;
    this.currentIntervalId = null;
  }

  async updateNowPlaying() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch Spotify data");
      }
      const spotifyData = await response.json();
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
      this.widgetElement.innerHTML = `+-------------------+
|${this.centerText(status)}|
|<div class="content-wrapper"><span class="scrolling-content" data-line="0">${this.formatContent(data.trackName)}</span></div>|
|<div class="content-wrapper"><span class="scrolling-content" data-line="1">${this.formatContent(data.artistName)}</span></div>|
+-------------------+
      `;
      this.setupScrolling(data.trackName, data.artistName);
    } else {
      this.widgetElement.innerHTML = `+-------------------+
|    NOT PLAYING    |
|                   |
|                   |
+-------------------+
      `;
    }
  }
  formatContent(text) {
    return text.length <= this.contentWidth
      ? this.centerText(text)
      : text.padEnd(this.contentWidth);
  }

  centerText(text) {
    const totalPadding = this.contentWidth - text.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
  }

  setupScrolling(trackName, artistName) {
    [trackName, artistName].forEach((content, index) => {
      this.stopScrolling(index);
      const element = this.widgetElement.querySelector(
        `.scrolling-content[data-line="${index}"]`,
      );
      if (!element) return;
      if (content.length <= this.contentWidth) {
        element.textContent = this.formatContent(content);
      } else {
        this.startScrolling(element, content);
      }
    });
  }

  startScrolling(element, content) {
    let position = 0;
    const extraSpaces = "     ";
    const paddedContent = content + extraSpaces + content;
    const scrollLength = content.length + extraSpaces.length;

    this.scrollIntervals[element.dataset.line] = setInterval(() => {
      element.textContent = paddedContent.substr(position, this.contentWidth);
      position = (position + 1) % scrollLength;
    }, 300);
  }

  stopScrolling(index) {
    clearInterval(this.scrollIntervals[index]);
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
    this.adjustUpdateInterval(false);  }

  toggle() {
    this.widgetElement.style.display =
      this.widgetElement.style.display === "none" ? "block" : "none";
  }
}
