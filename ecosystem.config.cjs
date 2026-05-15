module.exports = {
  apps: [
    {
      name: "aitonomous-next",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 7800",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "aitonomous-collab",
      script: "node_modules/.bin/tsx",
      args: "collab-server.ts",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
