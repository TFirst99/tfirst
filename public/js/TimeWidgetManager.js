import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class TimeWidgetManager {
    constructor() {
        this.timeElement = document.getElementById('time-widget');
        this.widgetUtil = new WidgetUtil(this.timeElement);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        });

        this.widgetUtil.updateWidget('TIME', timeString, dateString);
    }
    
    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
}
