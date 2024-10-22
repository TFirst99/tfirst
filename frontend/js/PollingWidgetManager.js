import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class PollingWidgetManager {
  constructor() {
    this.pollingProjectElement = document.getElementById("polling-project-widget");
    this.pollingProjectWidget = new WidgetUtil(this.pollingProjectElement, { width: 46 });
    this.jsonUrl = "/json/polling-project.json";
  }

  async updatePollingData() {
    try {
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch polling project");
      }
      const data = await response.json();
      this.updateWidget(data);
    } catch (error) {
      console.error("Error fetching polling project:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data) {
      this.pollingProjectWidget.updateWidget(
        ...data.project.map(line => ({ content: line })),
        { content: "View on GitHub", url: data.url }
      );
    } else {
      this.pollingProjectWidget.updateWidget(
        { content: "Error loading project" }
      );
    }
  }

  init() {
    this.updatePollingData();
  }
}
