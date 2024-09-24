const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const winston = require('winston');

require ('dotenv').config();
require('./github-worker/github-worker');
require('./spotify-worker/spotify-worker');
require('./server-worker/server-worker');

const port = process.env.PORT;
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const app = express();

const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.json()
     ),
     transports: [
       new winston.transports.File({ filename: path.join('/var/log', 'app.log') }),
       new winston.transports.Console()
     ]
   });

app.use(cors({
  origin: function (origin, callback) {
    logger.info(`Checking origin: ${origin}`);
    if (!origin) {
      return callback(null, true);
    }
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin === origin) {
        return true;
      }
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace('*', '[^.]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      return false;
    });
    if (isAllowed) {
      logger.info(`Origin ${origin} is allowed`);
      return callback(null, true);
    }
    logger.info(`Origin ${origin} is not allowed`);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.get('/', (req, res) => {
  res.send('hello :)');
});

app.get('/api/github', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'github-data.json'), 'utf8');
    const githubData = JSON.parse(data);
    res.set('Cache-Control', 'public, max-age=60');
    res.json(githubData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'No commit data found' });
    } else {
      logger.error('Error fetching latest commit:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/api/spotify', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'spotify-data.json'), 'utf8');
    const spotifyData = JSON.parse(data);
    res.set('Cache-Control', 'public, max-age=60');
    res.json(spotifyData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'No data available' });
    } else {
      logger.error('Error fetching Spotify data:', error);
      res.status(500).json({ error: 'Error fetching Spotify data' });
    }
  }
});

app.get('/api/server-stats', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'server-stats.json'), 'utf8');
    const serverStats = JSON.parse(data);
    res.set('Cache-Control', 'public, max-age=60');
    res.json(serverStats);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'No server stats available' });
    } else {
      logger.error('Error fetching server stats:', error);
      res.status(500).json({ error: 'Error fetching server stats' });
    }
  }
});

app.listen(port, '0.0.0.0', () => {
  logger.info(`Main application listening at http://localhost:${port}`);
});
