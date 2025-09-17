
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
    
    let shorturl = req.params.shorturl;
   
    const prefix = req.route.path.split(':')[0]; 
    console.log(prefix); 
     if (prefix === '/_/'){
       shorturl = '_/' + shorturl;
     }




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
  
       

        if(!shortURL){
          
          incrementCount = `UPDATE counter set count = count + 1 RETURNING count`;
          const result = await pool.query(incrementCount);
          let  count = result.rows[0].count;
          

          shortURL = '_/' + convertToBase62(count)

          insertQuery = `INSERT INTO mapping_long_short_url(original_url, short_url) VALUES($1,$2)`;
  
          await pool.query(insertQuery, [`${originalURL}`, `${shortURL}`]);
  
          res.json({
            original_url: `${originalURL}`,
            short_url: process.env.BASE_URL + "/" + shortURL,
          });
          return;
        
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
    
    
    
    
  function convertToBase62(number){
    
    let map = {
        0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
        10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f', 16: 'g', 17: 'h', 18: 'i', 19: 'j',
        20: 'k', 21: 'l', 22: 'm', 23: 'n', 24: 'o', 25: 'p', 26: 'q', 27: 'r', 28: 's', 29: 't',
        30: 'u', 31: 'v', 32: 'w', 33: 'x', 34: 'y', 35: 'z',
        36: 'A', 37: 'B', 38: 'C', 39: 'D', 40: 'E', 41: 'F', 42: 'G', 43: 'H', 44: 'I', 45: 'J',
        46: 'K', 47: 'L', 48: 'M', 49: 'N', 50: 'O', 51: 'P', 52: 'Q', 53: 'R', 54: 'S', 55: 'T',
        56: 'U', 57: 'V', 58: 'W', 59: 'X', 60: 'Y', 61: 'Z'
    }
    
    let remainder = number % 62;
    let quotient = (number - remainder) / 62 ;
    let newQuotient;
    
    let convertedNumber = [];

    if (quotient === 0 ){
      return map[number]
    }
    
    convertedNumber.push(map[remainder])
    
    while (quotient > 0) {
      remainder = quotient % 62
      newQuotient = (quotient - remainder) / 62 
    
      if ( newQuotient === 0){
        convertedNumber.push(map[quotient])
        quotient = newQuotient
      }
      else{
        convertedNumber.push(map[remainder])
        quotient = newQuotient
      }


    }    

    convertedNumber =  convertedNumber.reverse().join("")

    return convertedNumber
    

}   