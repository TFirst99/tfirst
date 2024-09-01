export class TimeWidgetManager {
    constructor() {
        this.timeElement = document.getElementById('time-widget');
    }

    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        });
        const timeHtml = `+-------------------+
|       TIME        |
|    ${this.padRight(timeString, 11)}    |
|     ${this.padRight(dateString, 10)}    |
+-------------------+`;

        this.timeElement.innerHTML = timeHtml;
    }

    padRight(str, length, padChar = ' ') {
        return str + padChar.repeat(Math.max(0, length - str.length));
    }
}
