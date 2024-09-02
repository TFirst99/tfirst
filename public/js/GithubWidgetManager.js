import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class GitHubWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("github-widget");
    this.apiUrl = "/api/github";
    this.widgetUtil = new WidgetUtil(this.widgetElement);
  }

  async updateLatestCommit() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub data");
      }
      const commitData = await response.json();
      this.updateWidget(commitData);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data && data.message) {
      const shortSha = data.sha.substring(0, 7);
      const shortMessage = data.message.length > 30 ? data.message.substring(0, 27) + '...' : data.message;
      this.widgetUtil.updateWidget("LAST COMMIT", shortMessage, `${data.repo} (${shortSha})`);
    } else {
      this.widgetUtil.updateWidget("LAST COMMIT", "not found", "");
    }
  }

  init() {
    this.updateLatestCommit();
  }
}
