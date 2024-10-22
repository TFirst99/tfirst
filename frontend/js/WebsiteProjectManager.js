import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class WebsiteProjectManager {
  constructor() {
    this.websiteProjectElement = document.getElementById("website-project-widget");
    this.websiteProjectWidget = new WidgetUtil(this.websiteProjectElement, { width: 46 });
    this.jsonUrl = "/json/website-project.json";
  }

  async updateWebsiteData() {
    try {
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch website project");
      }
      const data = await response.json();
      this.updateWidget(data);
    } catch (error) {
      console.error("Error fetching website project:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data) {
      this.websiteProjectWidget.updateWidget(
        ...data.project.map(line => ({ content: line })),
        { 
          content: 'VIEW ON GITHUB', 
          url: data.url
        }
      );
    } else {
      this.websiteProjectWidget.updateWidget(
        { content: "error loading link" }
      );
    }
  }

  init() {
    this.updateWebsiteData();
  }
}
