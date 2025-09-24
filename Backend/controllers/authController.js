const pool = require("../config/db");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.login = (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    if (!username) {
      return res.status(400).json({ error: "No username has been provided" });
    }

    if (!password) {
      return res.status(400).json({ error: "No password has been provided" });
    }

    if (req.isAuthenticated()) {
      res.json({
        message: `You are authenticated, your username is ${req.user.username}`,
        success: true,
      });
    }
  }


  exports.logout = (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to destroy session" });
        }

        res.clearCookie("connect.sid");
        return res.json({ message: "You are now logged out", success: true });
      });
    });
  }


  exports.register = async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const username = req.body.username;
        const password = req.body.password;
        // const selectQuery = `SELECT username FROM users WHERE username=$1`;
        // const selectResult = await pool.query(selectQuery, [username]);
        // const usernameExists = selectResult.rows.length;

        const existingUser = await prisma.users.findUnique({
          where: { username },
        });
      
        if (existingUser) {
          res
            .status(400)
            .json({ error: "This username is already taken.", path: "username" });
          return;
        }
  
        try {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
  
          // await pool.query(
          //   "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
          //   [username, hashedPassword]
          // );

        await prisma.users.create({
            data: {
              username,
              password: hashedPassword,
            },
          });
  
          res.json({ message: "You are now registered!" });
        } catch (err) {
            
          res.status(400).json({ error: "The server is down! Try again." });
        }
      }




      