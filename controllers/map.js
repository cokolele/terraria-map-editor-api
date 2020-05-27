const mapModel = require("../models/map.js");
const multer  = require('multer');
const { fileExists, validateDirectory } = require("../utils/utils.js");

const PUBLIC_MAPS_DIR = "/public/maps/";
const MAP_UPLOAD_DIR = "/users/maps/";
const mapUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fields: 0,
        files: 1,
        fileSize: 20*1024*1024,
        parts: 1,
        headerPairs: 100
    }
}).single("map");

module.exports = {
    getPublicMap: async (req, res) => {
        validateDirectory(req.app.get("config").contentDir + PUBLIC_MAPS_DIR);

        const filePath = req.app.get("config").contentDir + PUBLIC_MAPS_DIR + req.params.map + ".wld";

        if (fileExists(filePath))
            res.responses.successFile(filePath);
        else
            res.responses.notFound("Map not found");
    },

    getUserMaps: async (req, res) => {
        if (!req.session.loggedIn)
            return res.responses.unauthorized("Not logged in");

        const maps = await mapModel.getMapsByUserId(req.session.user.id);

        if (maps === false)
            return res.responses.internalError();

        res.responses.successData(maps);
    },

    saveUserMap: async (req, res) => {
        if (!req.session.loggedIn)
            return res.responses.unauthorized("Not logged in");

        mapUpload(req, res, (e) => {
            if (e) {
                if (e instanceof multer.MulterError) {
                    return res.responses.unprocessable(e.message);
                } else {
                    console.error("Map uploading error: ", e);
                    return res.responses.internalError();
                }
            }

            const isValidMapFile = mapModel.verifyFile(req.file.buffer);

            if (isValidMapFile === false)
                return res.responses.internalError();

            if (isValidMapFile.error)
                return res.responses.unprocessable(isValidMapFile.error);

            const mapSaved = mapModel.saveMap(
                req.file.originalname,
                req.file.buffer,
                req.file.size,
                req.session.user.id,
                req.app.get("config").contentDir + MAP_UPLOAD_DIR
            );

            if (mapSaved === false)
                return res.responses.internalError();

            return res.responses.success("Map saved");
        });
    },

    getUserMap: async (req, res) => {
        if (!req.session.loggedIn)
            return res.responses.unauthorized("Not logged in");

        const idMap = await mapModel.getMapById(req.params.id);

        if (idMap === false)
            return res.responses.internalError();

        if (idMap.length == 0)
            return res.responses.notFound("Map not found");

        if (idMap[0].id_account != req.session.user.id)
            return res.responses.unauthorized("Not authorized");

        res.responses.successFile(req.app.get("config").contentDir + MAP_UPLOAD_DIR + idMap[0].fileId);
    },

    deleteUserMap: async (req, res) => {
        if (!req.session.loggedIn)
            return res.responses.unauthorized("Not logged in");

        const idMap = await mapModel.getMapById(req.params.id);

        if (idMap === false)
            return res.responses.internalError();

        if (idMap.length == 0)
            return res.responses.notFound("Map not found");

        if (idMap[0].id_account != req.session.user.id)
            return res.responses.unauthorized("Not authorized");

        const mapDeleted = await mapModel.deleteMap(req.params.id, req.app.get("config").contentDir + MAP_UPLOAD_DIR + idMap[0].fileId);

        if (mapDeleted === false)
            return res.responses.internalError();

        res.responses.success("Map deleted");
    }
}