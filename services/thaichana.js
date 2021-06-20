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

const db = admin.firestore();

class Thaichana {
  constructor() {}

  async checkin() {
    return new Promise(async (resolve, reject) => {
      let auth_response;
      var responseCheckin = [];
      let shopInfomation = await this.getAllData();

      try {
        for (const item of shopInfomation) {
          if (item.canAutoCheckinOut && !item.isCheckIn) {
            if (item.generatedId) {
              auth_response = await this.getUsertoken(item.generatedId);
              await this.callCheckinAPI(auth_response.token, item).then(
                async result => {
                  await this.pushLineMessage(item);
                  await this.updateShopStatusOnDB(item, true);
                  responseCheckin.push(result);
                  item.mode = "CI";
                }
              );
            }
          }
        }
        console.log("LOG {THAICHANA} : checkin finally");
        console.log(responseCheckin);
        resolve(responseCheckin);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUsertoken(generatedId) {
    return new Promise(async (resolve, reject) => {
      let usertoken = await fetch(
        "https://api-scanner.thaichana.com/usertoken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": httpsAgent
          },
          body: JSON.stringify({
            generatedId: generatedId
          })
        }
      )
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            throw new Error("Something went wrong");
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  async pushLineMessage(item) {
    return new Promise(async (resolve, reject) => {
      var infomation = {
        userId: item.userId,
        message: `ระบบได้ทำการเช็ค ${
          item.mode == "CI" ? "อิน" : "เอาท์"
        } ร้านค้า ${item.title} ให้แล้วค่ะ`
      };

      let responseLine = await fetch(
        (process.env.NODE_ENV === "production"
          ? process.env.BASE_URL
          : "http://localhost:3000") + "/push-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": httpsAgent
          },
          body: JSON.stringify(infomation)
        }
      )
        .then(response => {
          if (response.ok) {
            resolve(response.json());
          } else {
            throw new Error("Something went wrong");
          }
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  callCheckinAPI(token, item) {
    return new Promise(async (resolve, reject) => {
      let responseCheckin = await fetch(
        `https://api-customer.thaichana.com/checkin?t=${moment()
          .tz("Asia/Bangkok")
          .unix()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token.trim(),
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
            item.isCheckIn = true;
            return resolve(item);
          } else {
            throw new Error("Something went wrong");
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  async updateShopStatusOnDB(item, statusValue) {
    return new Promise(async (resolve, reject) => {
      try {
        const snapshotIsExists = await db
          .collection("thaichana")
          .where("userId", "==", item.userId)
          .where("shopId", "==", item.shopId)
          .get();

        if (!snapshotIsExists.empty) {
          snapshotIsExists.forEach(async doc => {
            await doc.ref.update({
              isCheckIn: Boolean(statusValue)
            });
            console.log(doc.data().isCheckIn);
            resolve(doc);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getAllData() {
    return new Promise(async (resolve, reject) => {
      try {
        let users = {};
        let loadedShops = [];
        await db
          .collection("users")
          .get()
          .then(async result => {
            await result.forEach(doc => {
              users[doc.data().userId] = doc.data();
            });
            await db
              .collection("thaichana")
              .get()
              .then(async docSnap => {
                await docSnap.forEach(doc => {
                  let temp = {};
                  temp = doc.data();
                  temp.generatedId = users[doc.data().userId].generatedId;
                  loadedShops.push(temp);
                });
              });
          });
        await resolve(loadedShops);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default Thaichana;
