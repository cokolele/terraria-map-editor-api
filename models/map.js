const { asyncQuery } = require("../scripts/db.js");
const terrariaWorldParser = require("../terraria-world-file-js/src/node/terraria-world-parser.js");
const { validateDirectory, fileExists } = require("../utils/utils.js");
const { unlinkSync, writeFileSync } = require("fs");
const crypto = require("crypto");

const internalErrorHandler = (e) => {
    console.error(e);
    return false;
}

module.exports = {
    verifyFile: (file) => {
        try {
            try {
                new terrariaWorldParser().loadBuffer(file).parse({
                    sections: ["fileFormatHeader", "footer"]
                });
            } catch (e) {
                if (e.name == "TerrariaWorldParserError")
                    return { error: e.onlyMessage };
                else
                    throw e;
            }

            return true;
        } catch(e) {
            return internalErrorHandler(e);
        }
    },

    saveMap: async (filename, buffer, size, userId, savePath) => {
        let fileId;

        try {
            validateDirectory(savePath);

            do {
                fileId = crypto.randomBytes(20).toString("hex");
            } while (fileExists(savePath + fileId));
        } catch(e) {
            return internalErrorHandler(e);
        }

        try {
            writeFileSync(savePath + fileId, buffer);

            const insertUser = await asyncQuery(
                "INSERT INTO map VALUES (0, ?, ?, ?, ?, NOW())",
                [userId, fileId, filename, size]
            );

            return true;
        } catch (e) {
            unlinkSync(savePath + fileId);

            return internalErrorHandler(e);
        }
    },

    saveMapWithoutRecord: async (filename, buffer, savePath) => {
        try {
            validateDirectory(savePath);
            writeFileSync(savePath + filename, buffer);
        } catch(e) {
            return internalErrorHandler(e);
        }
    },

    getMapsByUserId: async (id) => {
        try {
            return await asyncQuery(
                "SELECT id, name, size FROM map WHERE id_account = ?",
                [id]
            );
        } catch (e) {
            return internalErrorHandler(e);
        }
    },

    getMapById: async (id) => {
        try {
            return await asyncQuery(
                "SELECT * FROM map WHERE id = ?",
                [id]
            );
        } catch (e) {
            return internalErrorHandler(e);
        }
    },

    deleteMap: async (mapId, saveFilePath) => {
        try {
            return await asyncQuery(
                "DELETE FROM map WHERE id = ?",
                [mapId],
                function() {
                    unlinkSync(saveFilePath);
                }
            );
        } catch (e) {
            return internalErrorHandler(e);
        }
    }
};