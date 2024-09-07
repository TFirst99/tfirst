module.exports = {
  apps : [{
    name: 'app',
    script: 'app.js',
    watch: false,
    error_file: '/var/log/app-error.log',
    out_file: '/var/log/app-out.log',
    log_file: '/var/log/app-combined.log',
    time: true
  }]
};
