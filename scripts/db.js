const mysql = require("mysql");

let dbConnection;

const initConnection = (config) => new Promise((resolve, reject) => {
    dbConnection = mysql.createConnection(config.db);
    dbConnection.connect(e => {
        if (e)
            reject(e);
        else
            resolve();
    });
});

const create = async (config, onDisconnect, onReconnect) => {
    try {
        await initConnection(config);

        dbConnection.on("error", async (e) => {
            if (e.fatal) {
                disconnectHandler(e);
            }
        });

        return dbConnection;
    } catch(e) {
        disconnectHandler(e);
        return null;
    }

    async function disconnectHandler(e) {
        dbConnection = null;
        onDisconnect(e);

        while (dbConnection === null) {
            try {
                await new Promise(r => setTimeout(r, 10000)); //sleep(10)
                await initConnection(config);
            } catch(e) {
                dbConnection = null;
                onDisconnect(e);
            }
        }

        dbConnection.on("error", async (e) => {
            if (e.fatal) {
                disconnectHandler(e);
            }
        });

        onReconnect(dbConnection);
    }
};

const asyncQuery = (queryString, paramArray, cb) => new Promise((resolve, reject) => {
    if (dbConnection === null) {
        return {
            status: "error",
            message: "Connection to database lost"
        };
    }

    const sql = mysql.format(queryString, paramArray);

    dbConnection.query(sql, (err, results) => {
        if (err)
            reject(err);
        else {
            if (cb) cb();
            resolve(results);
        }
    });
});

module.exports = {
    create,
    asyncQuery
};