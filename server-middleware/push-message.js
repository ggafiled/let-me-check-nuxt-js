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

function generateMessageStructure(to, message) {
    let template = {
        to: to,
        messages: [{
            type: "text",
            text: message
        }]
    };
    return template;
}

app.post("/", async(req, res) => {
            const response = await fetch("https://api.line.me/v2/bot/message/push", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer kS33WAWpGOQmSABYZ6/jGpT8YP4YvEaALbGm3ldNlqdibzji0cR1xCm1hJ1Ofcd8ICy3rvqayw4qNWtsiDHBZYxzWzL35+27G5coSZxOxT8S3ZbyU2vJqnV9jZHNY+//0Z4tluhOfV39LAQ/4oiguQdB04t89/1O/w1cDnyilFU=" //+ process.env.CHANNEL_ACCESS_TOKEN
                        },
                        body: JSON.stringify(
                                generateMessageStructure(
                                    req.body.userId,
                                    `${req.body.title} ${
          isCheckIn ? `ในช่วงเวลา ${moment().format("HH:mm")}` : ""
        }`
      )
    )
  })
    .then(response => response.json())
    .then(data => {
      return data;
    });
  return res.json({ status: "ok", req: req.body, response: response });
});

module.exports = app;