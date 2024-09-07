import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class GithubWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("github-widget");
    this.apiUrl = "https://api.timfirst.com/api/github";
    this.widgetUtil = new WidgetUtil(this.widgetElement);
    this.lastFetchTime = 0;
    this.cachedData = null;
    this.updateInterval = 15 * 60 * 1000;
  }

  async updateLatestCommit() {
    const now = Date.now();
    if (now - this.lastFetchTime < this.updateInterval && this.cachedData) {
      this.updateWidget(this.cachedData);
      return;
    }
  
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub data");
      }
      const commitData = await response.json();
      this.cachedData = commitData;
      this.lastFetchTime = now;
      this.updateWidget(commitData);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data && data.message) {
      const shortMessage = data.message.length > 30 ? data.message.substring(0, 27) + '...' : data.message;
      this.widgetUtil.updateWidget(
        "LAST COMMIT", 
        { content: shortMessage },
        { content: `${data.repo}` }
      );
    } else {
      this.widgetUtil.updateWidget(
        "LAST COMMIT",
        "not found",
        ""
      );
    }
  }

  init() {
    this.updateLatestCommit();
    setInterval(() => this.updateLatestCommit(), this.updateInterval);
  }
}
