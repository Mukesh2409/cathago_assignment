const express = require("express");
const { adminMiddleware, authMiddleware } = require("../middlewares/authMiddleware");
const {
    getAllUsers,
    approveCreditRequest,
    getAnalytics,
    getpendingReq,
    creditAnalytics,
    useractivity,
    updateCredits,
    deleteUsers,
    addUsers
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", authMiddleware, getAllUsers);
router.post('/users', addUsers);

router.post('/users', addUsers);
router.delete('/:id',  deleteUsers);
router.put('/:id/credits', updateCredits);
router.post("/credits/approve", adminMiddleware, approveCreditRequest);
router.get("/analytics", adminMiddleware, getAnalytics);
router.get("/pendingreq", adminMiddleware, getpendingReq);
router.get("/creditAnalytics", adminMiddleware, creditAnalytics)
router.get("/useractivity", adminMiddleware, useractivity)

module.exports = router;