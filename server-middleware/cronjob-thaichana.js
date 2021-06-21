const express = require("express");
const app = express();
var _ = require("lodash");
var moment = require("moment");
const bodyParser = require("body-parser");
var admin = require("firebase-admin");
import Thaichana from "../services/thaichana";
const ThaichanaInstance = new Thaichana();
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
  return res.json({ status: "ok", req: req.body, response: [] });
});

module.exports = app;
