const express = require("express");
const app = express();
const cors = require("cors");
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
const axios = require("axios");
require("dotenv").config();
moment.locale("th");

app.use(
  cors({
    credentials: true
  })
);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,GET,POST, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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
  let usertoken = await axios
    .post(
      "https://api-scanner.thaichana.com/usertoken",
      JSON.stringify({
        generatedId: "nayJlzoX0rerxUT9TgLAU"
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "User-Agent": httpsAgent,
          "X-Requested-With": "XMLHttpRequest"
        }
      }
    )
    .then(response => {
      console.log(response);
      return res.json({
        status: "ok",
        req: req.body,
        response: response.data
      });
    })
    .catch(error => {
      return res.json({
        status: "fail",
        realData: [],
        message: error.message
      });
    });
});

module.exports = app;
