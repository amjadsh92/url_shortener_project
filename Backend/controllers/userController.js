const pool = require("../config/db");

exports.listOfURLs = async function (req, res) {
  try {
    const username = req.query.username;
    const selectURLsQuery = `SELECT map_id, original_url, short_url FROM mapping_long_short_url WHERE username =$1`;
    const selectURLsResult = await pool.query(selectURLsQuery, [`${username}`]);
    let listOfURLs = selectURLsResult.rows;
    const numberOfURLs = listOfURLs.length;

    if (!numberOfURLs) {
      res.status(400).json({ error: "No URLs found." });
    } else if (listOfURLs) {
      res.json({ listOfURLs });
    }
  } catch {
    res.status(500).json({ error: "An error has occured when fetching URLs." });
  }
};

exports.checkIfUserAuthenticated = function (req, res) {
  console.log(req?.session);
  req.session.visited = (req.session.visited || 0) + 1;
  if (req?.session?.passport?.user) {
    return res.json({ isAuthenticated: true, username: req.user.username });
  } else {
    return res.json({ isAuthenticated: false, username: false });
  }
};

exports.test = function (req, res) {
  // console.log(req.headers.cookie)
  // console.log(req.session)
  // console.log(req.cookies)
  req.session.visited = (req.session.visited || 0) + 1;
  res.json({
    visits: `You have visited this endpoint ${req.session.visited} times`,
    user: req.user,
  });
  // res.json({ greeting: "hello API" });
};
