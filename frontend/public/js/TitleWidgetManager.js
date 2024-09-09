export class TitleWidgetManager {
  constructor() {
  this.container = document.getElementById('title-widget');
//figlet title
  this.titleText =
` _____ ___ __  __ _____ ___ ____  ____ _____                    
|_   _|_ _|  \\/  |  ___|_ _|  _ \\/ ___|_   _|___ ___  _ __ ___  
  | |  | || |\\/| | |_   | || |_) \\___ \\ | | / __/ _ \\| '_ \` _ \\ 
  | |  | || |  | |  _|  | ||  _ < ___) || || (_| (_) | | | | | |
  |_| |___|_|  |_|_|   |___|_| \\_\\____/ |_(_)___\\___/|_| |_| |_|`;,
  
  this.smallTitleText =
` _____ ___ __  __ _____ ___ ____  ____ _____ 
|_   _|_ _|  \\/  |  ___|_ _|  _ \\/ ___|_   _|
  | |  | || |\\/| | |_   | || |_) \\___ \\ | |  
  | |  | || |  | |  _|  | ||  _ < ___) || |  
  |_| |___|_|  |_|_|   |___|_| \\_\\____/ |_|  `;
  
  }
  init() {
    //main title
    const mainTitleContainer = document.createElement('div');
    mainTitleContainer.className = 'main-title';
    mainTitleContainer.innerHTML = this.titleText;

    //small title
    const smallTitleContainer = document.createElement('div');
    smallTitleContainer.className = 'small-title';
    smallTitleContainer.textContent = this.smallTitleText;

    //append to container
    this.container.appendChild(mainTitleContainer);
    this.container.appendChild(smallTitleContainer);
  }
}
