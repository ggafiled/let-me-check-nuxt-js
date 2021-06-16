var moment = require("moment-timezone");
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

export const state = () => ({
  dialog: {
    isShow: false,
    title: "",
    message: ""
  },
  authenticated: {
    userId: "",
    auth: false
  },
  register: {
    firstName: "",
    lastName: "",
    gender: 1,
    email: "",
    mobileNumber: "",
    position: ""
  },
  thaichana: {
    myshop: []
  },
  profile: {
    userId: "",
    displayName: "",
    pictureUrl: "",
    statusMessage: "",
    language: ""
  }
});

export const getters = {
  getRegister(state) {
    return state.register;
  },
  getDialog(state) {
    return state.dialog;
  },
  getProfile(state) {
    return state.profile;
  },
  getThaichana(state) {
    return state.thaichana;
  },
  getAuthenticated(state) {
    return state.authenticated;
  }
};

export const mutations = {
  SET_REGISTER(state, data) {
    state.register = {
      ...state.register,
      ...data
    };
  },
  SET_DIALOG(state, data) {
    state.dialog = {
      ...state.dialog,
      ...data
    };
  },
  SET_LINE_PROFILE(state, data) {
    state.profile = {
      ...state.profile,
      ...data
    };
  },
  SET_THAICHANA(state, data) {
    state.thaichana.myshop = [...data];
  },
  SET_INIT_STORE(state, data) {
    state.authenticated = {
      ...state.authenticated,
      ...data
    };
  }
};

export const actions = {
  setRegister({ commit }, data) {
    commit("SET_REGISTER", data);
  },
  setDialog({ commit }, data) {
    commit("SET_DIALOG", data);
  },
  setLineProfile({ commit }, data) {
    commit("SET_LINE_PROFILE", data);
  },
  async checkIsRegisted({ commit }) {
    try {
      const profileRef = this.$fire.firestore.collection("/users");
      const snapshot = await profileRef
        .where("userId", "==", this.state.profile.userId)
        .get();
      if (snapshot.empty) {
        this.$auth.$storage.removeLocalStorage("authenticated");
        console.log("No matching documents.");
        return;
      }

      await snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
        commit("SET_REGISTER", doc.data());
      });
      await this.$auth.$storage.setLocalStorage(
        "authenticated",
        JSON.stringify({
          userId: this.state.profile.userId,
          auth: true
        })
      );

      commit("SET_INIT_STORE", {
        userId: this.state.profile.userId,
        auth: Boolean(true)
      });
    } catch (e) {
      commit("SET_DIALOG", {
        isShow: true,
        title: "Authentication error",
        message: e.message
      });
      return;
    }
  },
  async getThaichana({ commit }) {
    const thaichanaUserRef = this.$fire.firestore.collection("thaichana");
    const { userId, auth } = await this.$auth.$storage.getLocalStorage(
      "authenticated"
    );

    try {
      const snapshot = await thaichanaUserRef
        .where("userId", "==", userId)
        .get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        return [];
      }

      let myShops = [];
      snapshot.forEach(childSnapshot => {
        myShops.push({
          userId: childSnapshot.data().userId,
          appId: childSnapshot.data().appId,
          businessType: childSnapshot.data().businessType,
          canCheckin: childSnapshot.data().canCheckin,
          shopId: childSnapshot.data().shopId,
          status: childSnapshot.data().status,
          subcategory: childSnapshot.data().subcategory,
          title: childSnapshot.data().title,
          isCheckIn: Boolean(childSnapshot.data().isCheckIn),
          canAutoCheckinOut: Boolean(childSnapshot.data().canAutoCheckinOut)
        });
      });
      commit("SET_THAICHANA", myShops);
    } catch (e) {
      commit("SET_DIALOG", {
        isShow: true,
        title: "Thaichana history error",
        message: e.message
      });
      return;
    }
  },
  async setThaichanaShop({ commit }, data) {
    const { userId, auth } = await this.$auth.$storage.getLocalStorage(
      "authenticated"
    );
    const thaichanaUserRef = this.$fire.firestore.collection("thaichana");
    try {
      const snapshotIsExists = await thaichanaUserRef
        .where("userId", "==", userId)
        .where("shopId", "==", data.shopId)
        .get();
      if (!snapshotIsExists.empty) {
        commit("SET_DIALOG", {
          isShow: true,
          title: "ขออภัย",
          message: "ขออภัยค่ะ คุณเพิ่มร้านค้านี้ไปแล้ว."
        });
        return;
      }

      let snapshotCount;
      const snapshotIsOverLimit = await thaichanaUserRef
        .where("userId", "==", userId)
        .get();

      snapshotCount = (await snapshotIsOverLimit.size) + 1;

      if (snapshotCount > 3) {
        commit("SET_DIALOG", {
          isShow: true,
          title: "ขออภัย",
          message: "ขออภัยค่ะ ตอนนี้คุณมีร้านค้าครบขีดจำกัดแล้ว."
        });
        return;
      } else {
        await thaichanaUserRef.doc().set(data);
        commit("SET_DIALOG", {
          isShow: true,
          title: "Success",
          message: `ระบบได้ทำการบันทึกร้านค้า ${data.title} ให้แล้วค่ะ`
        });
        try {
          var infomation = {
            appId: data.appId,
            businessType: data.businessType,
            canCheckin: data.canCheck,
            shopId: data.shopId,
            status: data.status,
            subcategory: data.subcategory,
            title: data.title,
            userId: data.userId,
            message: `ระบบได้ทำการบันทึกร้านค้า ${data.title} ให้แล้วค่ะ`,
            isCheckIn: false,
            canAutoCheckinOut: false
          };

          let response;
          if (process.env.NODE_ENV === "production") {
            response = this.$axios.$post(
              this.$config.BASE_URL + "/push-message",
              infomation,
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );
          }
        } catch (e) {
          commit("SET_DIALOG", {
            isShow: true,
            title: "เกิดข้อผิดพลาด",
            message: "ไม่สามารถส่งข้อความแจ้งเตือนได้ เนื่องจากพบปัญหาบางอย่าง"
          });
          return;
        }
      }
    } catch (e) {
      commit("SET_DIALOG", {
        isShow: true,
        title: "Thaichana history error",
        message: e.message
      });
      return;
    }
  },
  async getThaichanaShopNameByToken({ commit }, data) {
    const response = await this.$axios.$get(
      `https://api-customer.thaichana.com/shop/${data.appId}/${data.shopId}/qr`
    );
    return response;
  },
  initialiseStore({ commit }) {
    if (this.$auth.$storage.getLocalStorage("authenticated")) {
      const { userId, auth } = JSON.parse(
        JSON.stringify(this.$auth.$storage.getLocalStorage("authenticated"))
      );
      commit("SET_INIT_STORE", {
        userId: userId,
        auth: Boolean(auth)
      });
    }
  },
  async saveRegister({ commit, dispatch }, data) {
    const profileRef = this.$fire.firestore.collection("/users");

    try {
      await profileRef.doc().set(data);
      var infomation = {
        appId: data.appId,
        businessType: data.businessType,
        canCheckin: data.canCheck,
        shopId: data.shopId,
        status: data.status,
        subcategory: data.subcategory,
        title: data.title,
        userId: data.userId,
        message: `ลงทะเบียนเรียบร้อย ท่านสามารถเพิ่มร้านค้าได้แล้วตอนนี้`,
        isCheckIn: false
      };
      let response;
      if (process.env.NODE_ENV === "production") {
        response = this.$axios.$post(
          this.$config.BASE_URL + "/push-message",
          infomation,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
      dispatch("checkIsRegisted");
      console.log("Registed");
    } catch (e) {
      commit("SET_DIALOG", {
        isShow: true,
        title: "Thaichana history error",
        message: e.message
      });
      return;
    }
  },
  async removeShop({ commit }, data) {
    const { userId, auth } = await this.$auth.$storage.getLocalStorage(
      "authenticated"
    );
    console.log(`ACTION DELETE ${userId} : ${data.shopId}`);
    const thaichanaUserRef = this.$fire.firestore.collection("thaichana");
    try {
      const snapshotIsExists = await thaichanaUserRef
        .where("userId", "==", userId)
        .where("shopId", "==", data.shopId)
        .get();

      if (!snapshotIsExists.empty) {
        //TO DO REMOVE
        snapshotIsExists.forEach(async doc => {
          await doc.ref.delete();
        });
      }
    } catch (e) {
      commit("SET_DIALOG", {
        isShow: true,
        title: "Error",
        message: e.message
      });
      return;
    }
  },
  pushMessageToLine({ commit }, data) {
    return new Promise((resolve, reject) => {
      var infomation = {
        appId: data.appId,
        businessType: data.businessType,
        canCheckin: data.canCheck,
        shopId: data.shopId,
        status: data.status,
        subcategory: data.subcategory,
        title: data.title,
        userId: data.userId,
        message: `ระบบได้ทำการเช็คอินร้านค้า ${data.title} ให้แล้วค่ะ`,
        isCheckIn: false
      };

      this.$axios
        .$post(
          (process.env.NODE_ENV === "production" ? this.$config.BASE_URL : "") +
            "/push-message",
          infomation,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(data => resolve(data))
        .catch(error => {
          reject(error);
        });
    });
  },
  checkInThaichana({ commit }, data) {
    return new Promise(async (resolve, reject) => {
      var infomationAuth = {
        mobileNumber: data.mobileNumber
      };

      const auth_response = await fetch(
        "https://api-scanner.thaichana.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": httpsAgent
          },
          body: JSON.stringify(infomationAuth)
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
          reject(error);
        });

      var infomationCheckIn = {
        appId: data.appId,
        shopId: data.shopId
      };

      const response = await fetch(
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
          body: JSON.stringify(infomationCheckIn)
        }
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then(responseJson => {
          resolve(responseJson);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  async changeAutoChecInOutState({ commit }, data) {
    return new Promise(async (resolve, reject) => {
      const { userId, auth } = await this.$auth.$storage.getLocalStorage(
        "authenticated"
      );
      console.log(`ACTION changeAutoChecInOutState ${userId} : ${data.shopId}`);
      const thaichanaUserRef = this.$fire.firestore.collection("thaichana");
      try {
        const snapshotIsExists = await thaichanaUserRef
          .where("userId", "==", userId)
          .where("shopId", "==", data.shopId)
          .get();

        if (!snapshotIsExists.empty) {
          snapshotIsExists.forEach(async doc => {
            await doc.ref.update({
              canAutoCheckinOut: !Boolean(doc.data().canAutoCheckinOut)
            });
            console.log(doc.data().canAutoCheckinOut);
            resolve(doc);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  async changeShopStatusToCheckin({ commit }, data) {
    return new Promise(async (resolve, reject) => {
      const { userId, auth } = await this.$auth.$storage.getLocalStorage(
        "authenticated"
      );
      console.log(
        `ACTION changeShopStatusToCheckin ${userId} : ${data.shopId}`
      );
      const thaichanaUserRef = this.$fire.firestore.collection("thaichana");
      try {
        const snapshotIsExists = await thaichanaUserRef
          .where("userId", "==", userId)
          .where("shopId", "==", data.shopId)
          .get();

        if (!snapshotIsExists.empty) {
          snapshotIsExists.forEach(async doc => {
            await doc.ref.update({
              isCheckIn: true
            });
            console.log(doc.data().isCheckIn);
            resolve(doc);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  async checkIsAlreadyCheckin({ commit }, data) {
    return new Promise(async (resolve, reject) => {
      const { userId, auth } = await this.$auth.$storage.getLocalStorage(
        "authenticated"
      );
      console.log(`ACTION checkIsAlreadyCheckin ${userId} : ${data.shopId}`);
      const thaichanaUserRef = this.$fire.firestore.collection("thaichana");
      try {
        const snapshotIsExists = await thaichanaUserRef
          .where("userId", "==", userId)
          .where("shopId", "==", data.shopId)
          .get();

        if (!snapshotIsExists.empty) {
          snapshotIsExists.forEach(async doc => {
            resolve(doc);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
};
