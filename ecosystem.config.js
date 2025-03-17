module.exports = {
    apps: [
      {
        name: "asistente-telefonico",
        script: "./dist/index.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        env: {
          NODE_ENV: "production",
          PORT: 3000,
          SERVER_URL: "http://104.248.254.55"
        }
      }
    ]
  };