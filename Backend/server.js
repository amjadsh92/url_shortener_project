require("dotenv").config();
const app = require("./app");

const port = 3000;
const pool = require("./config/db");

const listenToServer = () => {
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  };

const connectToDatabase = async () => {
    await pool.connect();
    console.log("Connected to Postgres database");

    listenToServer();
  };


connectToDatabase()  
