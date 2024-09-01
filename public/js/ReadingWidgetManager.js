export class ReadingWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("reading-widget");
    this.jsonUrl = "/currently-reading.json";
    this.contentWidth = 19;
    this.scrollIntervals = [null, null];
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
    if (data && data.title) {
      this.widgetElement.innerHTML = `+-------------------+
|${this.centerText("CURRENTLY READING")}|
|<div class="content-wrapper"><span class="scrolling-content" data-line="0">${this.formatContent(data.title)}</span></div>|
|<div class="content-wrapper"><span class="scrolling-content" data-line="1">${this.formatContent(data.author)}</span></div>|
+-------------------+
      `;
      this.setupScrolling(data.title, data.author);
    } else {
      this.widgetElement.innerHTML = `+-------------------+
|${this.centerText("NOT READING")}|
|                   |
|                   |
+-------------------+
      `;
    }
  }

  formatContent(text) {
    return text.length <= this.contentWidth
      ? this.centerText(text)
      : text.padEnd(this.contentWidth);
  }

  centerText(text) {
    const totalPadding = this.contentWidth - text.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
  }

  setupScrolling(title, author) {
    [title, author].forEach((content, index) => {
      this.stopScrolling(index);
      const element = this.widgetElement.querySelector(
        `.scrolling-content[data-line="${index}"]`,
      );
      if (!element) return;
      if (content.length <= this.contentWidth) {
        element.textContent = this.formatContent(content);
      } else {
        this.startScrolling(element, content);
      }
    });
  }

  startScrolling(element, content) {
    let position = 0;
    const extraSpaces = "     ";
    const paddedContent = content + extraSpaces + content;
    const scrollLength = content.length + extraSpaces.length;
    this.scrollIntervals[element.dataset.line] = setInterval(() => {
      element.textContent = paddedContent.substr(position, this.contentWidth);
      position = (position + 1) % scrollLength;
    }, 300);
  }

  stopScrolling(index) {
    clearInterval(this.scrollIntervals[index]);
  }

  init() {
    this.updateCurrentlyReading();
  }

  toggle() {
    this.widgetElement.style.display =
      this.widgetElement.style.display === "none" ? "block" : "none";
  }
}
