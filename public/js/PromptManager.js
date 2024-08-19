export class PromptManager {
    constructor() {
        this.promptsContainer = document.getElementById('prompts');
    }

    init() {
        this.updatePrompts();
        window.addEventListener('resize', () => this.updatePrompts());
    }

    updatePrompts() {
        this.promptsContainer.innerHTML = '';
        const lineHeight = 16.5;
        const lines = Math.floor(window.innerHeight / lineHeight);
        
        for (let i = 0; i < lines; i++) {
            const promptElement = document.createElement('div');
            promptElement.className = 'prompt';
            promptElement.style.position = 'absolute';
            promptElement.style.top = `${i * lineHeight}px`;
            promptElement.textContent = '>';
            this.promptsContainer.appendChild(promptElement);
        }
    }
}