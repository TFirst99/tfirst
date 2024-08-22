export class SpotifyWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("spotify-widget");
    this.apiUrl = "/api/spotify";
    this.contentWidth = 19;
    this.scrollIntervals = [null, null];
  }

  async updateNowPlaying() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.updateWidget(data);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    const trackName = data?.trackName || "Not playing";
    const artistName = data?.artistName || "";
    this.widgetElement.innerHTML = this.createWidgetHTML(trackName, artistName);
    this.setupScrolling(trackName, artistName);
  }

  createWidgetHTML(trackName, artistName) {
    return `+-------------------+
|     SPOTIFY       |
|<div class="content-wrapper"><span class="scrolling-content" data-line="0">${this.formatContent(trackName)}</span></div>|
|<div class="content-wrapper"><span class="scrolling-content" data-line="1">${this.formatContent(artistName)}</span></div>|
+-------------------+`;
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
    const paddedContent = content + "     " + content;
    this.scrollIntervals[element.dataset.line] = setInterval(() => {
      element.textContent = paddedContent.substr(position, this.contentWidth);
      position = (position + 1) % content.length;
    }, 300);
  }

  stopScrolling(index) {
    clearInterval(this.scrollIntervals[index]);
  }

  init() {
    this.updateNowPlaying();
    setInterval(() => this.updateNowPlaying(), 60000); // Update every 60 seconds
  }

  toggle() {
    this.widgetElement.style.display =
      this.widgetElement.style.display === "none" ? "block" : "none";
  }
}
