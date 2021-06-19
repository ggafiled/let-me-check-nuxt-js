const express = require("express");
const app = express();
var moment = require("moment-timezone");
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

function generateMessageStructure(to, message) {
  let template = {
    to: to,
    messages: [
      {
        type: "text",
        text: message
      }
    ]
  };
  return template;
}

app.post("/", async (req, res) => {
  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.CHANNEL_ACCESS_TOKEN
    },
    body: JSON.stringify(
      generateMessageStructure(
        req.body.userId,
        `${req.body.message} ${
          req.body.isCheckIn
            ? `ในช่วงเวลา ${moment()
                .tz("Asia/Bangkok")
                .format("HH:mm")}`
            : ""
        }`
      )
    )
  })
    .then(response => response.json())
    .then(data => {
      return data;
    });
  return res.json({ message: "ok", req: req.body, response: response });
});

module.exports = app;
