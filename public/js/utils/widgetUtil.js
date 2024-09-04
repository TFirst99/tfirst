export class WidgetUtil {
  constructor(widgetElement, options = {}) {
    this.widgetElement = widgetElement;
    this.options = {
      width: 19,
      isExpandable: false,
      collapsedLines: 3,
      expandedLines: 3,
      ...options
    };
    this.isExpanded = false;
    this.lines = [];
    this.scrollIntervals = [];
    this.setupWidget();
  }

  updateWidget(data) {
    this.lines = this.processData(data);
    this.render();
    this.setupScrolling();
  }

  processData(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.createLine(item));
    } else if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => this.createLine({ title: key, content: value }));
    } else {
      return [this.createLine(data)];
    }
  }

  createLine(item) {
    if (typeof item === 'string') {
      return { content: item, isTitle: false };
    } else {
      return { title: item.title, content: item.content, isTitle: !!item.title };
    }
  }

  render() {
    const visibleLines = this.isExpanded ? this.lines : this.lines.slice(0, this.options.collapsedLines);
    const content = visibleLines.map(line => this.formatLine(line)).join('\n');
    const boxWidth = Math.max(...visibleLines.map(line => line.content.length), this.options.width);
    
    this.widgetElement.innerHTML = `
      +${'-'.repeat(boxWidth)}+
      ${content}
      +${'-'.repeat(boxWidth)}+
    `;
  }

  formatLine(line) {
    const { title, content, isTitle } = line;
    const boxWidth = Math.max(...this.lines.map(l => l.content.length), this.options.width);
    
    if (isTitle && this.options.isExpandable) {
      return `|${this.formatExpandableTitle(title, boxWidth)}|`;
    } else if (content.length <= boxWidth) {
      return `|${this.centerText(content, boxWidth)}|`;
    } else {
      return `|<div class="scrolling-content" data-content="${content}">${content.padEnd(boxWidth)}</div>|`;
    }
  }

  formatExpandableTitle(title, boxWidth) {
    const expandSymbol = this.isExpanded ? '▼' : '▶';
    const paddedTitle = this.centerText(title, boxWidth - 2);
    return `<span class="expandable-title">${expandSymbol} ${paddedTitle}</span>`;
  }

  centerText(text, width) {
    const paddingTotal = width - text.length;
    const paddingLeft = Math.floor(paddingTotal / 2);
    const paddingRight = paddingTotal - paddingLeft;
    return ' '.repeat(paddingLeft) + text + ' '.repeat(paddingRight);
  }

  setupScrolling() {
    this.stopAllScrolling();
    this.widgetElement.querySelectorAll('.scrolling-content').forEach(element => {
      const content = element.getAttribute('data-content');
      this.startScrolling(element, content);
    });
  }

  startScrolling(element, content) {
    let position = 0;
    const paddedContent = content + '     ' + content;
    const scrollLength = content.length + 5;
    
    const scroll = () => {
      element.textContent = paddedContent.substr(position, element.clientWidth);
      position = (position + 1) % scrollLength;
    };

    scroll();
    this.scrollIntervals.push(setInterval(scroll, 500));
  }

  stopAllScrolling() {
    this.scrollIntervals.forEach(clearInterval);
    this.scrollIntervals = [];
  }

  setupWidget() {
    if (this.options.isExpandable) {
      this.widgetElement.addEventListener('click', event => {
        if (event.target.closest('.expandable-title')) {
          this.toggleExpansion();
        }
      });
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
