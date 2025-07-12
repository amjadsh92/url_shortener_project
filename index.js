require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const URL = require("url").URL;
const bcrypt = require("bcrypt")
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pgSession = require("connect-pg-simple")(session);



const { Pool } = require("pg");

const pool = new Pool({
  user: "amjad",
  password: "123",
  host: "localhost",
  port: 5432,
  database: "long_short_url",
});

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: pool,
      tableName: 'session',
    }),
    cookie: { maxAge: 1000 * 60 * 1 },
  })
);


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) return done(null, false);
      const user = result.rows[0];
      const hashedPassword = result.rows[0].password
      const isValid = validPassword(password,hashedPassword);
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
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return done(null, false);
    return done(null, result.rows[0]);
  } catch (err) {
    return done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());


const connectToDatabase = async () => {
  await pool.connect();
  console.log("Connected to Postgres database");
  handleAPIs();
  listenToServer();
};

const handleAPIs = () => {
  app.get("/api/hello", function (req, res) {
    
    // console.log(req.headers.cookie)
    // console.log(req.session)
    // console.log(req.cookies)
  req.session.visited = (req.session.visited || 0) + 1;
  res.json({visits: `You have visited this endpoint ${req.session.visited} times`, user:req.user});
    // res.json({ greeting: "hello API" });
  });

  app.get("/:shorturl", async function (req, res) {
    const shorturl = req.params.shorturl;

    if (!shorturl) {
      res.status(400).json({ error: "No short url was provided" });
      return;
    }

    const query =
      "SELECT original_url FROM mapping_long_short_url WHERE short_url=$1";

    const result = await pool.query(query, [shorturl]);

    const shortURLExists = result.rows.length;

    if (shortURLExists) {
      const originalURL = result.rows[0].original_url;
      res.redirect(`${originalURL}`);
    } else {
      res.status(400).json({ error: "No short URL found for the given input" });
    }
  });

  app.post("/api/short-url", async function (req, res) {
    let originalURL = req.body.originalURL?.trim();
    let shortURL = req.body.shortSlug?.trim();

    if (!originalURL) {
      res
        .status(400)
        .json({ error: "No long_url has been provided", name: "long" });
      return;
    }

    const originalUrlLength = originalURL.length;
    if (originalUrlLength > 2048) {
      res.status(400).json({
        error: "You exceeded the maximum length of a url",
        name: "long",
      });
      return;
    }

    const containsHTTPSRegex = /^https?/i;
    const containsHTTPS = containsHTTPSRegex.test(originalURL);
    if (!containsHTTPS) {
      originalURL = "https://" + originalURL;
    }

    try {
      new URL(originalURL);

      if (!shortURL) {
        shortURL = Math.floor(Math.random() * (1000000 - 1)) + 1;
      }
      const shortUrlLength = shortURL.length;

      if (shortUrlLength > 100) {
        res.status(400).json({
          error: "The maximum number of characters in the slug should be 100",
          name: "short",
        });
        return;
      }

      const slugRegex = /^[a-zA-Z0-9_-]+$/;

      if (!slugRegex.test(shortURL)) {
        res.status(400).json({ error: "Invalid slug format.", name: "short" });
        return;
      }

      selectQuery = `SELECT original_url FROM mapping_long_short_url WHERE short_url=$1`;
      const result = await pool.query(selectQuery, [shortURL]);
      const shortUrlExists = result.rows.length;

      if (!shortUrlExists) {
        insertQuery = `INSERT INTO mapping_long_short_url(original_url, short_url) VALUES($1,$2)`;

        await pool.query(insertQuery, [`${originalURL}`, `${shortURL}`]);

        res.json({
          original_url: `${originalURL}`,
          short_url: process.env.BASE_URL + "/" + shortURL,
        });
        return;
      }

      const extracted_original_url = result.rows[0].original_url;

      if (extracted_original_url !== originalURL) {
        res
          .status(400)
          .json({ error: "The short_url already exists", name: "short" });
        return;
      }

      if (extracted_original_url === originalURL) {
        res.json({
          original_url: `${originalURL}`,
          short_url: process.env.BASE_URL + "/" + shortURL,
        });
      }
    } catch (e) {
      res.status(400).json({
        error: "The long_url you have provided is invalid",
        name: "long",
      });
    }
  });


  // 
  
  app.post("/api/login", 
    passport.authenticate("local"), (req, res) => {
     
      if (req.isAuthenticated()) {
        res.json({message:`You are authenticated, your username is ${req.user.username}`, success:true});
      } 
    });
  

  app.post("/api/register", async function (req, res) {

      let username = req.body.username?.trim()
      let password = req.body.password

      if (!username){
        res.status(400).json({error:"The username can't be empty!"})
        return
      }
      if (!password){
        res.status(400).json({error:"The password can't be empty!"})
        return
      }
    
      try {
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const result = await pool.query(
          'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
          [username, hashedPassword]
        );
    
        res.json({message:"You are now registered!"})
      } catch (err) {
        res.status(400).json({error:"Registration failed! Try again."})
      }
    
})

};

const listenToServer = () => {
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
};


const validPassword = async (enteredPassword, storedHash) => {

  const isValid = await bcrypt.compare(enteredPassword, storedHash);

  if (isValid) {
    return true
  } else {
    return false
  }
}

connectToDatabase();
