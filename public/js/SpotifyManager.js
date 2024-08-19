export class SpotifyManager {
    constructor() {
        this.widgetElement = document.getElementById('spotify-widget');
        this.apiUrl = '/api/spotify';
        this.contentWidth = 19;
        this.scrollPositions = [0, 0];
        this.scrollIntervals = [null, null];
        this.indentSpaces = 4;
    }

    async updateNowPlaying() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.updateWidget(data);
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
            this.updateWidget(null);
        }
    }

    updateWidget(data) {
        let trackName = 'Not playing';
        let artistName = '';
        if (data && data.trackName) {
            trackName = data.trackName;
            artistName = data.artistName;
        }
        this.widgetElement.innerHTML = this.createWidgetHTML(trackName, artistName);
        this.startScrolling(trackName, artistName);
    }

    init() {
        this.updateNowPlaying();
        setInterval(() => this.updateNowPlaying(), 60000); // Update every 60 seconds
    }

    createWidgetHTML(trackName, artistName) {
        const centeredTrack = this.centerText(trackName);
        const centeredArtist = this.centerText(artistName);
        return `
+-------------------+
|      SPOTIFY      |
|<div class="content-wrapper"><span class="scrolling-content" data-line="0">${centeredTrack}</span></div>|
|<div class="content-wrapper"><span class="scrolling-content" data-line="1">${centeredArtist}</span></div>|
+-------------------+`;
    }

    centerText(text) {
        if (text.length <= this.contentWidth) {
            const totalPadding = this.contentWidth - text.length;
            const leftPadding = Math.floor(totalPadding / 2);
            const rightPadding = totalPadding - leftPadding;
            return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
        }
        return text;
    }

    startScrolling(trackName, artistName) {
        const contents = [trackName, artistName];
        
        for (let i = 0; i < 2; i++) {
            if (this.scrollIntervals[i]) {
                clearInterval(this.scrollIntervals[i]);
            }
            
            const scrollingContent = this.widgetElement.querySelector(`.scrolling-content[data-line="${i}"]`);
            if (!scrollingContent) continue;
            
            this.scrollPositions[i] = 0;
            const fullContent = contents[i] + '     ';
            
            if (fullContent.length <= this.contentWidth) {
                scrollingContent.textContent = this.centerText(fullContent);
                continue;
            }
            
            this.scrollIntervals[i] = setInterval(() => {
                let visibleContent = fullContent.substring(this.scrollPositions[i]) + fullContent.substring(0, this.scrollPositions[i]);
                visibleContent = visibleContent.substring(0, this.contentWidth);
                scrollingContent.textContent = visibleContent;
                
                this.scrollPositions[i] = (this.scrollPositions[i] + 1) % fullContent.length;
            }, 300);  // scroll speed
        }
    }

    toggle() {
        this.widgetElement.style.display = this.widgetElement.style.display === 'none' ? 'block' : 'none';
    }
}