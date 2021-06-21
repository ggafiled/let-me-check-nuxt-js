const express = require("express");
const app = express();
var _ = require("lodash");
var moment = require("moment");
const bodyParser = require("body-parser");
var admin = require("firebase-admin");
var fetch = require("node-fetch");
import Thaichana from "../services/thaichana";
const ThaichanaInstance = new Thaichana();
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});
require("dotenv").config();
moment.locale("th");

app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.CLIENT_EMAIL
    }),
    databaseURL: process.env.DATABASE_URL
  });
} else {
  admin.app();
}

app.get("/checkin", async (req, res) => {
  try {
    let realData = await ThaichanaInstance.checkin();
    return res.json({
      status: "ok",
      realData: realData
    });
  } catch (error) {
    return res.json({
      status: "fail",
      realData: [],
      message: error.message
    });
  }
});

app.get("/checkout", async (req, res) => {
  try {
    let realData = await ThaichanaInstance.checkout();
    return res.json({
      status: "ok",
      realData: realData
    });
  } catch (error) {
    return res.json({
      status: "fail",
      realData: [],
      message: error.message
    });
  }
});

app.get("/beacon-event", async (req, res) => {
  let usertoken = await fetch("https://api-scanner.thaichana.com/usertoken", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "User-Agent": httpsAgent
    },
    body: JSON.stringify({
      generatedId: "nayJlzoX0rerxUT9TgLAU"
    })
  })
    .then(response => {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
    })
    .catch(error => {
      console.log(error);
    });
  return res.json({ status: "ok", req: req.body, response: usertoken });
});

module.exports = app;
