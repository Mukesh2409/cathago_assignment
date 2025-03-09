const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    getUserInfo,
    getPastScans,
    uploadFile,
    requestCredits,
    creditreport,
    getmatches,
    getDocContent
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authMiddleware, getUserInfo);
router.get("/scans", authMiddleware, getPastScans);
router.post("/scan", authMiddleware, upload.single("file"), uploadFile);
router.get("/document/:docId"  , authMiddleware , getDocContent)
router.post("/credits/request", authMiddleware, requestCredits);
router.get("/credits/report" , authMiddleware,creditreport )
router.get("/matches/:id", authMiddleware,getmatches)

module.exports = router;