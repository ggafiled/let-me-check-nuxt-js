const express = require("express");
const app = express();
var moment = require("moment");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
moment.locale("th");

app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  return res.json({ status: "ok", req: req.body, response: [] });
});

module.exports = app;
