const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const resources = JSON.parse(fs.readFileSync(`${__dirname}/data/resources.json`));

dotenv.config();
const app = express();

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
const PORT = process.env.PORT || 3000;

app.use(express.json());



module.exports = { app, server }; // Export both app and server