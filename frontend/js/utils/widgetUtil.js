export class WidgetUtil {
  constructor(widgetElement, options = {}) {
    this.widgetElement = widgetElement;
    this.options = {
      width: 21,
      ...options
    };
    this.lines = [];
    this.scrollIntervals = [];
  }

  updateWidget(...lines) {
    this.lines = lines;
    this.render();
    this.setupScrolling();
  }

  render() {
      const content = this.lines.map((line, index) => this.formatLine(line, index)).join('<br>');
      this.widgetElement.innerHTML = `+${'-'.repeat(this.options.width - 2)}+<br>${content}<br>+${'-'.repeat(this.options.width - 2)}+`;
  }

  formatLine(line, index) {
    if (typeof line === 'object' && line !== null) {
      if (line.url) {
        const style = line.style ? ` style="${line.style}"` : '';
        return `|<div class="content-wrapper"><a href="${line.url}" target="_blank" class="scrolling-content"${style} data-line="${index}">${line.content}</a></div>|`;
      }
      return `|<div class="content-wrapper"><span class="scrolling-content" data-line="${index}">${this.formatContent(line.content)}</span></div>|`;
    }
    return `|${this.centerText(line)}|`;
  }

  formatContent(text) {
    return text.length <= this.options.width - 2 ? this.centerText(text) : text.padEnd(this.options.width - 2);
  }

  centerText(text) {
    const contentWidth = this.options.width - 2;
    const paddingTotal = contentWidth - text.length;
    const paddingLeft = Math.floor(paddingTotal / 2);
    const paddingRight = paddingTotal - paddingLeft;
    return ' '.repeat(paddingLeft) + text + ' '.repeat(paddingRight);
  }

  setupScrolling() {
    this.stopAllScrolling();
    this.lines.forEach((line, index) => {
      if (typeof line === 'object' && line !== null) {
        const element = this.widgetElement.querySelector(`.scrolling-content[data-line="${index}"]`);
        if (element && line.content.length > this.options.width - 2) {
          this.startScrolling(element, line.content, index);
        }
      }
    });
  }

  startScrolling(element, content, index) {
    let position = 0;
    const paddedContent = content + '     ' + content;
    const scrollLength = content.length + 5;
    
    element.textContent = paddedContent.substr(0, this.options.width - 2);

    this.scrollIntervals[index] = setInterval(() => {
      element.textContent = paddedContent.substr(position, this.options.width - 2);
      position = (position + 1) % scrollLength;
    }, 500);
  }

  stopAllScrolling() {
    this.scrollIntervals.forEach(clearInterval);
    this.scrollIntervals = [];
  }
}
