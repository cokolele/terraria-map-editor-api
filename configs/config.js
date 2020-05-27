const path = require("path");
const secrets = require("./secrets.js");

const serverRootDir = path.resolve(__dirname, "..");
const env = process.env.NODE_ENV || "development";

const profiles = {
    "development": {
        db: {
            host: "localhost",
            user: "root",
            password: secrets.dbDevRootPass,
            database: "twe",
            port: 3306
        }
    },
    "production": {
        db: {
            host: "localhost",
            user: "root",
            password: secrets.dbProdRootPass,
            database: "twe",
            port: 3306
        }
    }
}

module.exports = {
    ...profiles[env],
    port: 3000,
    contentDir: path.join(serverRootDir, "/content"),
    env,
    serverRootDir,
    secrets
};
