const fetch = require('node-fetch');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchAndStoreLatestCommit() {
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'Node.js Worker'
  };

  const eventsResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events`, { headers });
  const events = await eventsResponse.json();

  let latestCommit = null;
  let latestTimestamp = 0;

  function isMergeCommit(commitMessage) {
    return commitMessage.startsWith('Merge') || commitMessage.includes('Merge branch');
  }

  for (const event of events) {
    if (event.type === 'PushEvent') {
      const eventTimestamp = new Date(event.created_at).getTime();
      
      const nonMergeCommits = event.payload.commits.filter(commit => !isMergeCommit(commit.message));
      if (nonMergeCommits.length === 0) continue;

      const lastCommit = nonMergeCommits[nonMergeCommits.length - 1];
      
      if (eventTimestamp > latestTimestamp) {
        latestTimestamp = eventTimestamp;
        latestCommit = {
          repo: event.repo.name,
          sha: lastCommit.sha,
          message: lastCommit.message,
          date: event.created_at,
          url: `https://github.com/${event.repo.name}/commit/${lastCommit.sha}`
        };
      }
    }
  }

  if (latestCommit) {
    console.log('Latest commit:', latestCommit);
    await fs.writeFile(path.join(__dirname, '..', 'github-data.json'), JSON.stringify(latestCommit));
  } else {
    console.log('No recent non-merge commits found');
  }
}

// Run the task every minute
cron.schedule('* * * * *', () => {
  console.log('Running GitHub worker');
  fetchAndStoreLatestCommit();
});

console.log('GitHub worker started');
