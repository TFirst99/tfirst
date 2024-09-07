const fs = require('fs').promises;
const path = require('path');
const si = require('systeminformation');
const cron = require('node-cron');

function formatNumber(num, isPercentage = false) {
  let formattedNum;
  if (num >= 10) {
    formattedNum = Math.round(num).toString();
  } else {
    formattedNum = num.toFixed(1);
  }
  return formattedNum + (isPercentage ? '%' : '');
}

function formatNetworkStat(mb) {
  if (mb < 0.1) {
    return formatNumber(mb * 1024) + 'KB';
  }
  return formatNumber(mb) + 'MB';
}

async function getAverageNetworkStats(duration = 60000) {
  const start = await si.networkStats();
  
  await new Promise(resolve => setTimeout(resolve, duration));
  
  const end = await si.networkStats();
  
  const durationInSeconds = duration / 1000;
  
  const calcAverage = (start, end) => {
    return end.map((end, i) => ({
      iface: end.iface,
      rx_sec: (end.rx_bytes - start[i].rx_bytes) / durationInSeconds / 1024 / 1024,
      tx_sec: (end.tx_bytes - start[i].tx_bytes) / durationInSeconds / 1024 / 1024
    }));
  };

  return calcAverage(start, end);
}

async function gatherAndStoreServerStats() {
  try {
    const [cpu, mem, netStats] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      getAverageNetworkStats(60000) // 1 minute average
    ]);

    const stats = {
      cpuUsage: formatNumber(cpu.currentLoad, true),
      memoryUsage: formatNumber((mem.active / mem.total) * 100, true),
      networkInbound: formatNetworkStat(netStats.reduce((total, stat) => total + stat.rx_sec, 0)),
      networkOutbound: formatNetworkStat(netStats.reduce((total, stat) => total + stat.tx_sec, 0)),
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(path.join(__dirname, '..', 'server-stats.json'), JSON.stringify(stats, null, 2));
    console.log('Server stats updated:', stats);
  } catch (error) {
    console.error('Error gathering server stats:', error);
  }
}

// Run the task every minute
cron.schedule('* * * * *', () => {
  console.log('Running server stats worker');
  gatherAndStoreServerStats();
});

// Initial run
gatherAndStoreServerStats();
console.log('Server stats worker started');
