export class TitleWidgetManager {
  constructor() {
    this.titles = new Map();
    this.container = document.getElementById('title-widget');
  }

  async init() {
    await this.loadTitles('/json/titles');
    this.addAllTitlesToContainers();
  }

  async loadTitles(folderPath) {
    try {
      const response = await fetch(`${folderPath}/index.json`);
      const fileList = await response.json();

      for (const file of fileList) {
        const titleResponse = await fetch(`${folderPath}/${file}`);
        const titleData = await titleResponse.json();
        this.createTitle(titleData.id, titleData);
      }
    } catch (error) {
      console.error('Error loading titles:', error);
    }
  }

  createTitle(id, data) {
    const titleElement = document.createElement('div');
    titleElement.id = id;
    titleElement.className = 'title-widget';

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id') {
        const titleDiv = document.createElement('div');
        titleDiv.className = `${key}-title`;
        titleDiv.textContent = value;
        titleElement.appendChild(titleDiv);
      }
    });

    this.titles.set(id, titleElement);
    return titleElement;
  }

  addAllTitlesToContainers() {
    this.titles.forEach((titleElement, id) => {
      const containerId = `${id}-container`;
      this.addTitleToContainer(id, containerId);
    });
  }

  addTitleToContainer(id, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }

    const titleElement = this.titles.get(id);
    if (!titleElement) {
      console.error(`Title with id ${id} not found`);
      return;
    }

    container.appendChild(titleElement);
  }
}
