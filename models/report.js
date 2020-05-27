const { asyncQuery } = require("../scripts/db.js");

const internalErrorHandler = (e) => {
    console.error(e);
    return false;
}

module.exports = {
    saveError: async (text) => {
        try {
            await asyncQuery(
                "INSERT INTO error VALUES (0, ?, NOW())",
                [text]
            );
            return true;
        } catch (e) {
            return internalErrorHandler(e);
        }
    },

    saveErrorAuto: async (text) => {
        try {
            await asyncQuery(
                "INSERT INTO error_auto VALUES (0, ?, NOW())",
                [text]
            );
            return true;
        } catch (e) {
            return internalErrorHandler(e);
        }
    },

    saveSuggestion: async (text) => {
        try {
            await asyncQuery(
                "INSERT INTO suggestion VALUES (0, ?, NOW())",
                [text]
            );
            return true;
        } catch (e) {
            return internalErrorHandler(e);
        }
    }
};