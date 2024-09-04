import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class AboutWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("about-widget");
    this.jsonUrl = "/about.json";
    this.widgetUtil = new WidgetUtil(this.widgetElement, {
      isExpandable: true,
      collapsedLines: 1
    });
  }

  async updateAboutInfo() {
    try {
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch about data");
      }
      const aboutData = await response.json();
      this.updateWidget(aboutData);
    } catch (error) {
      console.error("Error fetching about data:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data) {
      const lines = ["ABOUT", ...data.content.map(line => ({ content: line }))];
      this.widgetUtil.updateWidget(...lines);
    } else {
      this.widgetUtil.updateWidget("ABOUT", "No information available");
    }
  }

  init() {
    this.updateAboutInfo();
  }
}
