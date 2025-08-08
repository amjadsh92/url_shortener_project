const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

router.delete("/api/deleteURL/:id", urlController.deleteURL);

router.get("/:shorturl", urlController.redirectURL)

router.post("/api/short-url", urlController.createShortURL)

// Export router
module.exports = router;