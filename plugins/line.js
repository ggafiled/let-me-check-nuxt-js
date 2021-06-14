import Vue from "vue";
// import * as line from "@line/bot-sdk";
const axios = require("axios");
require("dotenv").config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

class Client {
  constructor(config) {
    this.config = config;
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + config.channelAccessToken
    };
  }

  pushMessage(to, message) {
    console.log(`pushMessage(to=${to}, message=${message})`);
    return new Promise((resolve, reject) => {
      axios
        .post(
          "https://api.line.me/v2/bot/message/push",
          this.generateMessageStructure(to, message)
        )
        .then(res => {
          resolve(res);
        })
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
}

Vue.prototype.$line = new Client(config);
