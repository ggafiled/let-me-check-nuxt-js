const express = require("express");
const app = express();
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
  let thaichanaDocs = await admin
    .firestore()
    .collection("thaichana")
    .get();

  var response = [];
  await thaichanaDocs.docs.forEach(async doc => {
    if (!doc.data().isCheckIn && doc.data().canAutoCheckinOut) {
      response = await ThaichanaInstance.checkin(
        doc.data().appId,
        doc.data().shopId,
        doc.data().userId,
        true
      );
    }
  });
  return res.json({ status: "ok", req: req.body, response: response });
});

app.get("/checkout", async (req, res) => {
  let thaichanaDocs = await admin
    .firestore()
    .collection("thaichana")
    .get();

  let response = [];
  thaichanaDocs.docs.forEach(doc => {
    response.push(doc.data());
  });
  return res.json({ status: "ok", req: req.body, response: thaichanaDocs });
});

app.get("/beacon-event", async (req, res) => {
  return res.json({ status: "ok", req: req.body, response: [] });
});

module.exports = app;
