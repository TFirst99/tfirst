import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class TimeWidgetManager {
    constructor() {
        this.timeElement = document.getElementById('time-widget');
        this.widgetUtil = new WidgetUtil(this.timeElement);
        this.intervalId = null;
        this.paused = false;
    }

    updateTime() {
        if (this.paused) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        });

        this.widgetUtil.updateWidget(
          "TIME",
          { content: timeString },
          { content: dateString }
        );
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    stop() {
        this.pause();
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    init() {
        this.updateTime();
        this.intervalId = setInterval(() => this.updateTime(), 1000);
    }
}
