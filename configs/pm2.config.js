const path = require("path");
const config = require("./config.js");

module.exports = {
    apps : [
        {
            name: "api",
            script: path.join(config.serverRootDir, "server.js"),
            cwd: config.serverRootDir,
            error_file: path.join(config.serverRootDir, "/logs/api-server-error.log"),
            out_file: path.join(config.serverRootDir, "/logs/api-server-out.log"),
            log_file: path.join(config.serverRootDir, "/logs/api-server-combined.log"),
            time: true,
            watch: false,
            env: {
                "NODE_ENV": "development"
            },
            env_production: {
                "NODE_ENV": "production",
            },
        }
    ]
}
