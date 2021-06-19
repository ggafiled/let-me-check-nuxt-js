var admin = require("firebase-admin");
var _ = require("lodash");
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

  joinTables(left, right, leftKey, rightKey) {
    rightKey = rightKey || leftKey;

    var lookupTable = {};
    var resultTable = [];
    var forEachLeftRecord = function(currentRecord) {
      lookupTable[currentRecord[leftKey]] = currentRecord;
    };

    var forEachRightRecord = function(currentRecord) {
      var joinedRecord = _.clone(lookupTable[currentRecord[rightKey]]); // using lodash clone
      _.extend(joinedRecord, currentRecord); // using lodash extend
      resultTable.push(joinedRecord);
    };

    left.forEach(forEachLeftRecord);
    right.forEach(forEachRightRecord);

    return resultTable;
  }

  async checkin() {
    let auth_response;
    let responseCheckin;
    let shopInfomation = await this.getAllData();
    shopInfomation.forEach(async item => {
      if (item.generatedId) {
        auth_response = await fetch(
          "https://api-scanner.thaichana.com/usertoken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": httpsAgent
            },
            body: JSON.stringify({
              generatedId: item.generatedId
            })
          }
        )
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Something went wrong");
            }
          })
          .catch(error => {
            console.log(error);
          });

        responseCheckin = await fetch(
          `https://api-customer.thaichana.com/checkin?t=${moment()
            .tz("Asia/Bangkok")
            .unix()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth_response.token.trim(),
              "User-Agent": httpsAgent
            },
            body: JSON.stringify({
              appId: item.appId,
              shopId: item.shopId
            })
          }
        )
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Something went wrong");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }

      console.log(auth_response);
    });
    return shopInfomation;
  }

  getAllData() {
    return new Promise(async (resolve, reject) => {
      try {
        let thaichanaDocs = await admin
          .firestore()
          .collection("thaichana")
          .get();

        var response = [];
        await thaichanaDocs.docs.forEach(async snap => {
          await response.push(snap.data());
        });
        let userdocs = await admin
          .firestore()
          .collection("users")
          .get();
        var responseUser = [];
        await userdocs.docs.forEach(async snap => {
          await responseUser.push({
            userId: snap.data().userId,
            generatedId: snap.data().generatedId
          });
        });

        let realData = this.joinTables(
          response,
          responseUser,
          "userId",
          "userId"
        );
        resolve(realData);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default Thaichana;
