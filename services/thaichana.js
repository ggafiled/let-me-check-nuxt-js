"use strict";
var admin = require("firebase-admin");
var moment = require("moment-timezone");
var fetch = require("node-fetch");
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});
require("dotenv").config();

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

class Thaichana {
  constructor() {}

  checkin(appId, shopId, lineUserId, alert = false) {
    /**
     * Promise Function
     * @param {String} appId
     * @param {String} shopId
     * @param {String} lineUserId
     * @param {Boolean} alert
     */
    return new Promise(async (resolve, reject) => {
      let thaichanaDocs = await admin
        .firestore()
        .collection("thaichana")
        .where("userId", "==", lineUserId)
        .where("shopId", "==", shopId)
        .get();

      let userDocs = await admin
        .firestore()
        .collection("users")
        .where("userId", "==", lineUserId)
        .get();

      let shopInfo = [];
      await thaichanaDocs.forEach(async doc => {
        await userDocs.forEach(udoc => {
          doc.data().generatedId = udoc.data().generatedId;
          shopInfo.push({
            ...doc.data(),
            ...udoc.data()
          });
        });
      });

      return resolve(shopInfo);
    });
  }
}

export default Thaichana;
