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
              auth_response = await this.getUsertoken(item.generatedId); //มีปัญหายิง request ไม่ได้
              await this.callCheckinAPI(auth_response.token, item).then(
                async result => {
                  item.mode = "CI";
                  // await this.pushLineMessage(item);
                  // await this.updateShopStatusOnDB(item, true);
                  responseCheckin.push(result);
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

  async checkout() {
    return new Promise(async (resolve, reject) => {
      let auth_response;
      var responseCheckout = [];
      let shopInfomation = await this.getAllData();

      try {
        for (const item of shopInfomation) {
          if (item.canAutoCheckinOut && item.isCheckIn) {
            if (item.generatedId) {
              auth_response = await this.getUsertoken(item.generatedId);
              await this.callCheckoutAPI(auth_response.token, item).then(
                async result => {
                  item.mode = "CO";
                  await this.pushLineMessage(item);
                  await this.updateShopStatusOnDB(item, false);
                  responseCheckout.push(result);
                }
              );
            }
          }
        }
        console.log("LOG {THAICHANA} : checkout finally");
        console.log(responseCheckout);
        resolve(responseCheckout);
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
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": httpsAgent
          },
          body: JSON.stringify({
            generatedId: "nayJlzoX0rerxUT9TgLAU"
          })
        }
      )
        .then(response => {
          console.log(response);
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  async pushLineMessage(item) {
    return new Promise(async (resolve, reject) => {
      var message = `ระบบได้ทำการเช็ค ${
        item.mode == "CI" ? "อิน" : "เอาท์"
      } ร้านค้า ${item.title} ให้แล้วค่ะ`;

      let response = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.CHANNEL_ACCESS_TOKEN
        },
        body: JSON.stringify(
          this.generateMessageStructure(
            item.userId,
            `${message} ในช่วงเวลา ${moment()
              .tz("Asia/Bangkok")
              .format("HH:mm")}`
          )
        )
      })
        .then(response => resolve(response.json()))
        .catch(error => {
          reject(error);
        });
    });
  }

  generateMessageStructure(to, message) {
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
            throw new Error("Something went wrong from callCheckinAPI");
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  callCheckoutAPI(token, item) {
    return new Promise(async (resolve, reject) => {
      let responseCheckin = await fetch(
        `https://api-customer.thaichana.com/checkout?t=${moment()
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
            item.isCheckIn = false;
            return resolve(item);
          } else {
            throw new Error("Something went wrong from callCheckoutAPI");
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
