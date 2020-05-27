const router = require("express").Router();
const mapController = require("../controllers/map.js");
const reportController = require("../controllers/report.js");

router.post("/report/error", reportController.reportError);
router.post("/report/suggestion", reportController.reportSuggestion);
router.post("/report/error-auto", reportController.reportErrorAuto);

router.get("/public/maps/:map", mapController.getPublicMap)
router.get("/user/maps", mapController.getUserMaps);
router.post("/user/maps", mapController.saveUserMap);
router.get("/user/maps/:id", mapController.getUserMap);
router.delete("/user/maps/:id", mapController.deleteUserMap);

module.exports = router;