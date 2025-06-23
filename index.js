require("dotenv").config();
const { isUrl } = require("check-valid-url");
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("node:dns");
const URL = require("url").URL;
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const { Pool } = require("pg");

const pool = new Pool({
  user: "amjad",
  password: "123",
  host: "localhost",
  port: 5432,
  database: "long_short_url",
});

const connectToDatabase = async () => {
  await pool.connect();
  console.log("Connected to Postgres database");
  handleAPIs();
  listenToServer();
};

const handleAPIs = () => {
  app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
  });

  app.get("/:shorturl", async function (req, res) {
    const shorturl = req.params.shorturl;

    if (!shorturl) {
      res.json({ error: "error" });
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
      res.json({ error: "No short URL found for the given input" });
    }
  });

  app.post("/api/short-url", async function (req, res) {
    let originalURL = req.body.originalURL;
    let shortURL = req.body.shortURL;

    if (!originalURL) {
      res.status(400).json({ error: "Invalid url" });
      return;
    }

    try {
      new URL(originalURL);

      if (!shortURL) {
        shortURL = Math.floor(Math.random() * (1000000 - 1)) + 1;
      }

      selectQuery = `SELECT original_url FROM mapping_long_short_url WHERE short_url=$1`;
      const result = await pool.query(selectQuery, [shortURL]);
      const shortUrlExists = result.rows.length;

      if (!shortUrlExists) {
        insertQuery = `INSERT INTO mapping_long_short_url(original_url, short_url) VALUES($1,$2)`;

        await pool.query(insertQuery, [`${originalURL}`, `${shortURL}`]);

        res.json({ original_url: `${originalURL}`, short_url: process.env.BASE_URL + "/" + shortURL });
        return;
      }

      const extracted_original_url = result.rows[0].original_url;

      if (extracted_original_url !== originalURL) {
        res.status(400).json({ error: "This short_url already exists" });
        return;
      }

      if (extracted_original_url && extracted_original_url === originalURL) {
        res.json({ original_url: `${originalURL}`, short_url: shortURL });
      }
    } catch (e) {
      res
        .status(400)
        .json({ error: "The domain is invalid or an error has occured" });
    }
  });
};

const listenToServer = () => {
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
};

connectToDatabase();
