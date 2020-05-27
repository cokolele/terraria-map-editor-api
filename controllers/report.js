const reportModel = require("../models/report.js");

module.exports = {
    reportError: async (req, res) => {
        if (await reportModel.saveError(req.body.text))
            res.responses.success("Saved");
        else
            res.responses.internalError();
    },

    reportErrorAuto: async (req, res) => {
        if (await reportModel.saveErrorAuto(req.body.text))
            res.responses.success("Saved");
        else
            res.responses.internalError();
    },

    reportSuggestion: async (req, res) => {
        if (await reportModel.saveSuggestion(req.body.text))
            res.responses.success("Saved");
        else
            res.responses.internalError();
    }
};