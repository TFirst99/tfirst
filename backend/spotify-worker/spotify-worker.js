const fetch = require('node-fetch');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

let cachedToken = null;
let tokenExpirationTime = 0;

async function getAccessToken() {
  const currentTime = Date.now();

  if (cachedToken && currentTime < tokenExpirationTime - 60000) {
    return cachedToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpirationTime = currentTime + (data.expires_in * 1000);

  return cachedToken;
}

async function getCurrentTrack(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get current track: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.item ? formatTrackData(data.item, data.is_playing) : null;
}

async function getRecentlyPlayedTrack(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to get recently played track: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.items && data.items.length > 0 ? formatTrackData(data.items[0].track, false) : null;
}

function formatTrackData(item, isPlaying) {
  return {
    trackName: item.name,
    artistName: item.artists[0].name,
    albumName: item.album.name,
    albumArt: item.album.images[0].url,
    isPlaying: isPlaying
  };
}

async function updateSpotifyData() {
  try {
    const accessToken = await getAccessToken();
    let trackData = await getCurrentTrack(accessToken);
    
    if (!trackData) {
      trackData = await getRecentlyPlayedTrack(accessToken);
    }
    
    if (trackData) {
      console.log('Spotify data:', trackData);
      await fs.writeFile(path.join(__dirname, '..', 'spotify-data.json'), JSON.stringify(trackData));
    } else {
      console.log('No track data available');
    }
  } catch (error) {
    console.error('Error updating Spotify data:', error);
  }
}

// Run the task every minute
cron.schedule('* * * * *', () => {
  console.log('Running Spotify worker');
  updateSpotifyData();
});

console.log('Spotify worker started');
