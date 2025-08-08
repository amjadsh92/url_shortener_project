const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


// Get the URLS of a specific user
router.get("/api/user", userController.listOfURLs)

// Check if a user is authenticated or not
router.get("/api/authentication", userController.checkIfUserAuthenticated)

// Just for testing
router.get("/api/hello", userController.test);



// Export router
module.exports = router;