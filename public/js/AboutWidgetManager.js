import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class AboutWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("about-widget");
    this.jsonUrl = "/about.json";
    this.widgetUtil = new WidgetUtil(this.widgetElement);
  }

  async updateAboutWidget() {
    try {
      const response = await fetch(this.aboutJsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch about data");
      }
      const aboutData = await response.json();
      this.aboutWidget.updateWidget("ABOUT", ...aboutData.lines);
    } catch (error) {
      console.error("Error fetching about data:", error);
      this.aboutWidget.updateWidget("ABOUT", "Error loading data");
    }
  }

  updateWidget(data) {
    if (data) {
      this.widgetUtil.updateWidget(
        "ABOUT",
      );
    } else {
      this.widgetUtil.updateWidget("ABOUT");
    }
  }

  init() {
    this.updateUpdateAbout();
  }
}
