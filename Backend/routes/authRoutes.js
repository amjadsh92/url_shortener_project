
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body} = require("express-validator");

const authController = require("../controllers/authController");

//login user
router.post("/api/login",passport.authenticate("local"),authController.login)

//logout user
router.post("/api/logout",authController.logout)

//register user
router.post("/api/register",[
    body("username")
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be 4-20 characters long")
      .isAlphanumeric()
      .withMessage("Username must contain only letters and numbers"),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be strong (1 upper, 1 lower, 1 number, 1 symbol) and minimum length of 8 charachters"
      ),
  ], authController.register)


  module.exports = router