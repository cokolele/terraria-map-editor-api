const config = require("./configs/config.js");
const db = require("./scripts/db.js");
const app = require("./scripts/app.js");

(async function() {
    function log(...msg) {
        const time = new Date();
        console.log(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`, ...msg);
    }

    function error(...msg) {
        const time = new Date();
        console.error(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`, ...msg);
    }

    log("TME_API: Starting the API server...");

    let dbConnection = null;

    const onDBDisconnect = (e) => {
        error("TME_API: Couldn't connect to database:: ", e);
        app.onDBDisconnect();
    }

    const onDBReconnect = (_dbConnection) => {
        log("TME_API: Connection to database restored...")
        app.onDBReconnect();
    }

    dbConnection = await db.create(config, onDBDisconnect, onDBReconnect);

    if (dbConnection === null)
        log("TME_API: Starting the server without database...");
    else
        log("TME_API: Connected to database with id " + dbConnection.threadId + "...");

    try {
        app.create(config, dbConnection);
        app.start(() => {
            log("TME_API: listening on port " + config.port);
        });
    } catch(e) {
        error("TME_API: Fatal app error:", e);
    }

})();