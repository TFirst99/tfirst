import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class AboutWidgetManager {
  constructor() {
    this.titleElement = document.getElementById("about-title-widget");
    this.studentElement = document.getElementById("about-student-widget");
    this.personalElement = document.getElementById("about-personal-widget");
    this.titleWidget = new WidgetUtil(this.titleElement, { width: 21 });
    this.studentWidget = new WidgetUtil(this.studentElement, { width: 21 });
    this.personalWidget = new WidgetUtil(this.personalElement, { width: 21 });
    this.jsonUrl = "/about.json";
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
      this.titleWidget.updateWidget(
        "ABOUT ME"
      );
      this.studentWidget.updateWidget(
        "STUDENT",
        ...data.student.map(line => ({ content: line })),
      );
      this.personalWidget.updateWidget(
        "PERSONAL",
        ...data.personal.map(line => ({ content: line }))
      );
    } else {
      this.titleWidget.updateWidget(
        "ABOUT ME"
      );
      this.studentWidget.updateWidget(
        "if you're seeing this"
      );
      this.personalWidget.updateWidget(
        "it didn't load lol."
      );
    }
  }

  init() {
    this.updateAboutData();
  }
}
