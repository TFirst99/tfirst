export class WidgetUtil {
  constructor(widgetElement, options = {}) {
    this.widgetElement = widgetElement;
    this.options = {
      width: 21,
      isExpandable: false,
      collapsedLines: 1,
      ...options
    };
    this.isExpanded = !this.options.isExpandable;
    this.lines = [];
    this.scrollIntervals = [];
    this.setupExpandability();
  }

  updateWidget(...lines) {
    this.lines = lines;
    this.render();
    this.setupScrolling();
  }

  render() {
    const visibleLines = this.isExpanded ? this.lines : this.lines.slice(0, this.options.collapsedLines);
    const content = visibleLines.map(line => this.formatLine(line)).join('\n');
    this.widgetElement.innerHTML = `+${'-'.repeat(this.options.width - 2)}+\n${content}\n+${'-'.repeat(this.options.width - 2)}+`;
  }

  formatLine(text) {
    if (typeof text === 'object' && text !== null) {
      return `|<div class="content-wrapper"><span class="scrolling-content">${this.formatContent(text.content)}</span></div>|`;
    }
    return `|${this.centerText(text)}|`;
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
        const element = this.widgetElement.querySelector(`.scrolling-content:nth-child(${index + 1})`);
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

    this.scrollIntervals[index] = setInterval(() => {
      element.textContent = paddedContent.substr(position, this.options.width - 2);
      position = (position + 1) % scrollLength;
    }, 300);
  }

  stopAllScrolling() {
    this.scrollIntervals.forEach(clearInterval);
    this.scrollIntervals = [];
  }

  setupExpandability() {
    if (this.options.isExpandable) {
      this.widgetElement.style.cursor = 'pointer';
      this.widgetElement.addEventListener('click', () => this.toggleExpansion());
    }
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
    this.render();
    this.setupScrolling();
    this.widgetElement.dispatchEvent(new CustomEvent('widgetExpansionChanged', {
      detail: { isExpanded: this.isExpanded }
    }));
  }
}
