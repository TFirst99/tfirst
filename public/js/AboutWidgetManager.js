import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class AboutWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("about-widget");
    this.jsonUrl = "/about.json";
    this.widgetUtil = new WidgetUtil(this.widgetElement);
  }

  async updateAbout() {
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
      this.widgetUtil.updateWidget("ABOUT", ...data.lines);
    } else {
      this.widgetUtil.updateWidget("ABOUT");
    }
  }

  init() {
    this.updateUpdateAbout();
  }
}
