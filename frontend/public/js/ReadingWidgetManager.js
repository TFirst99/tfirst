import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class ReadingWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("reading-widget");
    this.jsonUrl = "/json/currently-reading.json";
    this.widgetUtil = new WidgetUtil(this.widgetElement);
  }

  async updateCurrentlyReading() {
    try {
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch book data");
      }
      const bookData = await response.json();
      this.updateWidget(bookData);
    } catch (error) {
      console.error("Error fetching book data:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data) {
      this.widgetUtil.updateWidget(
        "READING",
        { content: data.title },
        { content: data.author }
      );
    } else {
      this.widgetUtil.updateWidget("NOT READING");
    }
  }

  init() {
    this.updateCurrentlyReading();
  }
}
