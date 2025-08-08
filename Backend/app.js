require("dotenv").config();
const pool = require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pgSession = require("connect-pg-simple")(session);



app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    cookie: { maxAge: 1000 * 60 * 30 },
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (result.rows.length === 0) return done(null, false);
      const user = result.rows[0];
      const hashedPassword = result.rows[0].password;
      const isValid = await validPassword(password, hashedPassword);
      if (isValid) return done(null, user);
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
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return done(null, false);
    return done(null, result.rows[0]);
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





