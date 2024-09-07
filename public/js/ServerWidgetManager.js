import { WidgetUtil } from '/js/utils/widgetUtil.js';

export class ServerWidgetManager {
  constructor() {
    this.widgetElement = document.getElementById("server-widget");
    this.apiUrl = "https://api.timfirst.com/api/server-stats";
    this.widgetUtil = new WidgetUtil(this.widgetElement);
    this.lastFetchTime = 0;
    this.cachedData = null;
    this.updateInterval = 1 * 60 * 1000;
  }

  async updateServerStats() {
    const now = Date.now();
    if (now - this.lastFetchTime < this.updateInterval && this.cachedData) {
      this.updateWidget(this.cachedData);
      return;
    }
  
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch server data");
      }
      const serverData = await response.json();
      this.cachedData = serverData;
      this.lastFetchTime = now;
      this.updateWidget(serverData);
    } catch (error) {
      console.error("Error fetching server data:", error);
      this.updateWidget(null);
    }
  }

  updateWidget(data) {
    if (data && data.cpuUsage && data.memoryUsage && data.networkInbound && data.networkOutbound) {
      const hardwareInfo = `CPU:${data.cpuUsage} MEM:${data.memoryUsage}`;
      const networkInfo = `IN:${data.networkInbound} OUT:${data.networkOutbound}`;
      this.widgetUtil.updateWidget(
        "SERVER STATS",
        { content: hardwareInfo },
        { content: networkInfo }
      );
    } else {
      this.widgetUtil.updateWidget(
        "SERVER STATS",
        "No data",
        ""
      );
    }
  }



  init() {
    this.updateServerStats();
    setInterval(() => this.updateServerStats(), this.updateInterval);
  }
}
