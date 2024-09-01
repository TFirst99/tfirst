export class WidgetUtil {
  constructor(widgetElement, contentWidth = 19) {
    this.widgetElement = widgetElement;
    this.contentWidth = contentWidth;
    this.scrollIntervals = [null, null];
  }

  updateWidget(titleLine, secondLine, thirdLine) {
    this.widgetElement.innerHTML = `+-------------------+
|${this.centerText(titleLine)}|
|<div class="content-wrapper"><span class="scrolling-content" data-line="0">${this.formatContent(secondLine)}</span></div>|
|<div class="content-wrapper"><span class="scrolling-content" data-line="1">${this.formatContent(thirdLine)}</span></div>|
+-------------------+
    `;
    this.setupScrolling(secondLine, thirdLine);
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

  setupScrolling(secondLine, thirdLine) {
    [secondLine, thirdLine].forEach((content, index) => {
      this.stopScrolling(index);
      const element = this.widgetElement.querySelector(
        `.scrolling-content[data-line="${index}"]`
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
}
