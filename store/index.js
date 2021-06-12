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
                console.log("No matching documents.");
                return;
            }

            snapshot.forEach(doc => {
                // console.log(doc.id, "=>", doc.data());
                commit("SET_REGISTER", doc.data());
            });
            this.$auth.$storage.setLocalStorage(
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
                    appId: childSnapshot.data().appId,
                    businessType: childSnapshot.data().businessType,
                    canCheckin: childSnapshot.data().canCheckin,
                    shopId: childSnapshot.data().shopId,
                    status: childSnapshot.data().status,
                    subcategory: childSnapshot.data().subcategory,
                    title: childSnapshot.data().title
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
                    title: "Info",
                    message: "Sory this shop has exists in system already."
                });
                return;
            }

            let snapshotCount;
            const snapshotIsOverLimit = await thaichanaUserRef
                .where("userId", "==", userId)
                .get();

            snapshotCount = await snapshotIsOverLimit.size;

            if (snapshotCount > 3) {
                commit("SET_DIALOG", {
                    isShow: true,
                    title: "Info",
                    message: "Sorry your shop is over limit."
                });
                return;
            }

            thaichanaUserRef.doc().set(data);
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
    async saveRegister({ commit }, data) {
        const profileRef = this.$fire.firestore.collection("/users");

        try {
            await profileRef.doc().set(data);
            await liff
                .sendMessages([{
                    type: "text",
                    text: "ลงทะเบียนเรียบร้อย ท่านสามารถเพิ่มร้านค้าได้แล้วตอนนี้"
                }])
                .then(() => {
                    console.log("message sent");
                })
                .catch(err => {
                    console.log("error", err);
                });
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
    }
};