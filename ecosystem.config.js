module.exports = {
  apps: [{
    name: 'testtask-backend',
    script: 'src/server.js',
    cwd: '/var/www/testtask',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3010
    },
    error_file: '/var/log/pm2/testtask-backend-error.log',
    out_file: '/var/log/pm2/testtask-backend-out.log',
    log_file: '/var/log/pm2/testtask-backend-combined.log',
    time: true
  }]
};