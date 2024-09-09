export class TitleWidgetManager {
  constructor() {
  this.container = document.getElementById('title-widget');
//figlet title
  this.titleText =
` _____ ___ __  __ _____ ___ ____  ____ _____
|_   _|_ _|  \\/  |  ___|_ _|  _ \\/ ___|_   _|___ ___  _ __ ___
  | |  | || |\\/| | |_   | || |_) \\___ \\ | | / __/ _ \\| '_ \` _ \\
  | |  | || |  | |  _|  | ||  _ < ___) || || (_| (_) | | | | | |
  |_| |___|_|  |_|_|   |___|_| \\_\\____/ |_(_)___\\___/|_| |_| |_|`;
  }

  init() {
    this.container.innerHTML = this.titleText;
  }
}
