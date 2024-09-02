export class ShortcutsWidgetManager {
    constructor() {
        this.shortcuts = document.querySelector('.shortcuts');
        this.code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.codeIndex = 0;
    }

    toggleElements() {
        const isVisible = localStorage.getItem('elementsVisible') === 'true';
        this.shortcuts.style.display = isVisible ? 'none' : 'flex';
        localStorage.setItem('elementsVisible', (!isVisible).toString());
        console.log(`Elements ${isVisible ? 'hidden' : 'revealed'}`);
    }

    addKeydownListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.code[this.codeIndex]) {
                this.codeIndex++;
                if (this.codeIndex === this.code.length) {
                    this.toggleElements();
                    this.codeIndex = 0;
                }
            } else {
                this.codeIndex = 0;
            }
        });
    }

    checkInitialVisibility() {
        if (localStorage.getItem('elementsVisible') === 'true') {
            this.shortcuts.style.display = 'flex';
        }
    }
    
    init() {
        this.addKeydownListener();
        this.checkInitialVisibility();
    }
}
