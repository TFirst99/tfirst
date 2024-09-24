import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class AboutWidgetManager {
  constructor() {
    this.about0Element = document.getElementById("about0-widget");
    this.about1Element = document.getElementById("about1-widget");
    this.about2Element = document.getElementById("about2-widget");
    this.about0Widget = new WidgetUtil(this.about0Element, { width: 21 });
    this.about1Widget = new WidgetUtil(this.about1Element, { width: 21 });
    this.about2Widget = new WidgetUtil(this.about2Element, { width: 21 });
    this.jsonUrl = "/json/about.json";
  }

  async updateAboutData() {
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
      this.about0Widget.updateWidget(
        ...data.about0.map(line => ({ content: line })),
      );
      this.about1Widget.updateWidget(
        ...data.about1.map(line => ({ content: line })),
      );
      this.about2Widget.updateWidget(
        ...data.about2.map(line => ({ content: line }))
      );
    } else {
      this.about0Widget.updateWidget(
        "oops"
      );
      this.about1Widget.updateWidget(
        "if you're seeing this"
      );
      this.about2Widget.updateWidget(
        "it didn't load lol."
      );
    }
  }

  init() {
    this.updateAboutData();
  }
}
