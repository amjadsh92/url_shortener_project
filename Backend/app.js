require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const { PrismaClient } = require('./generated/prisma');
const { PrismaSessionStore } = require("@rabithua/prisma-session-store");
const prisma = new PrismaClient();

// app.use(
//  cors({
//    origin: "http://localhost:5173",
//    credentials: true,
//  })
// );
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;




app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore({
    prisma: prisma,
    
  }),
    cookie: { maxAge: 1000 * 60 * 30 },
  })
);



passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.users.findUnique({
        where: { username },
      });

      if (!user) return done(null, false);

      const isValid = await validPassword(password, user.password);
      if (isValid) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err);
    }
  })
);


passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});


app.use(passport.initialize());
app.use(passport.session());


app.use(require("./routes"));

const validPassword = async (enteredPassword, storedHash) => {
    const isValid = await bcrypt.compare(enteredPassword, storedHash);
  
    return isValid;
  };


module.exports = app





