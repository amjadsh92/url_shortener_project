const express = require("express");
const router = express.Router();

router.use(require("./authRoutes"));
router.use(require("./userRoutes"));
router.use(require("./urlRoutes"));

module.exports = router;