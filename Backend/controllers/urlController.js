
const pool = require("../config/db");


//Delete a URL from the database

exports.deleteURL  = async function (req, res) {
    try {
      const id = req.params.id;
      const deleteURLQuery =
        "DELETE FROM mapping_long_short_url WHERE map_id=$1";
      const deleteURLResult = await pool.query(deleteURLQuery, [`${id}`]);
      if (deleteURLResult.rowCount === 1) {
        return res.json({ message: "The URL has been deleted successfully." });
      } else if (deleteURLResult.rowCount === 0) {
        return res.json({ error: "This URL doesn't exist in our database." });
      }
    } catch {
      return res
        .status(500)
        .json({ error: "The server is down, Try again later." });
    }
  };

//redirect a short URL to Original URL

exports.redirectURL =   async function (req, res) {
    const shorturl = req.params.shorturl;

    if (!shorturl) {
      res.status(400).json({ error: "No short URL was provided." });
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
      
      res.status(400).json({ error: "No short URL found for the given input." });
    }
  }

// Create a Short URL that is linked to a long URL for a specific user

  exports.createShortURL = async function (req, res) {
      let originalURL = req.body.originalURL?.trim();
      let shortURL = req.body.shortSlug?.trim();
      let username = req.body.username;
  
      if (!originalURL) {
        res
          .status(400)
          .json({ error: "No long URL has been provided.", name: "long" });
        return;
      }
  
      if (shortURL && !req?.session?.passport?.user) {
        res
          .status(401)
          .json({ error: "You need to be logged in.", name: "short" });
        return;
      }
  
      const originalUrlLength = originalURL.length;
      if (originalUrlLength > 2048) {
        res.status(400).json({
          error: "You exceeded the maximum length of a URL.",
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
            error: "The maximum number of characters in the slug should be 100.",
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
  
        if (!shortUrlExists && !username) {
          insertQuery = `INSERT INTO mapping_long_short_url(original_url, short_url) VALUES($1,$2)`;
  
          await pool.query(insertQuery, [`${originalURL}`, `${shortURL}`]);
  
          res.json({
            original_url: `${originalURL}`,
            short_url: process.env.BASE_URL + "/" + shortURL,
          });
          return;
        }
  
        if (!shortUrlExists && username) {
          insertQuery = `INSERT INTO mapping_long_short_url(original_url, short_url, username) VALUES($1,$2,$3)`;
  
          await pool.query(insertQuery, [
            `${originalURL}`,
            `${shortURL}`,
            `${username}`,
          ]);
  
          selectIdQuery =
            "SELECT map_id FROM mapping_long_short_url WHERE original_url=$1 AND short_url=$2 AND username=$3";
          const selectIdResult = await pool.query(selectIdQuery, [
            `${originalURL}`,
            `${shortURL}`,
            `${username}`,
          ]);
          const idExtracted = selectIdResult.rows[0].map_id;
  
          res.json({
            map_id: idExtracted,
            original_url: `${originalURL}`,
            short_url: process.env.BASE_URL + "/" + shortURL,
            username: `${username}`,
          });
          return;
        }
  
        const extracted_original_url = result.rows[0].original_url;
  
        if (extracted_original_url !== originalURL) {
          res
            .status(400)
            .json({
              error: "This short URL already corresponds to a different URL.",
              name: "short",
            });
          return;
        }
  
        if (extracted_original_url === originalURL) {
          if (!username) {
            return res.json({
              original_url: `${originalURL}`,
              short_url: process.env.BASE_URL + "/" + shortURL,
            });
          }
  
          selectUsername =
            "SELECT username FROM mapping_long_short_url WHERE original_url=$1 AND short_url=$2 AND username=$3";
          const usernameResult = await pool.query(selectUsername, [
            `${originalURL}`,
            `${shortURL}`,
            `${username}`,
          ]);
          const usernameExtracted = usernameResult?.rows[0]?.username;
  
          if (!usernameExtracted) {
            insertQuery = `INSERT INTO mapping_long_short_url(original_url, short_url, username) VALUES($1,$2,$3)`;
            await pool.query(insertQuery, [
              `${originalURL}`,
              `${shortURL}`,
              `${username}`,
            ]);
            selectIdQuery =
              "SELECT map_id FROM mapping_long_short_url WHERE original_url=$1 AND short_url=$2 AND username=$3";
            const selectIdResult = await pool.query(selectIdQuery, [
              `${originalURL}`,
              `${shortURL}`,
              `${username}`,
            ]);
            const idExtracted = selectIdResult.rows[0].map_id;
  
            return res.json({
              map_id: idExtracted,
              original_url: `${originalURL}`,
              short_url: process.env.BASE_URL + "/" + shortURL,
              username: `${username}`,
            });
          }
          
          res
            .status(400)
            .json({
              error:
                "This short URL is already in your list.",
              name:"short"  
            });
        }
      } catch (e) {
        console.log(e);
        res.status(400).json({
          error: "The long URL you have provided is invalid.",
          name: "long",
        });
      }
    }