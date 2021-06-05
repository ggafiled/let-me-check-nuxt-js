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
        state.thaichana.myshop = [...state.thaichana.myshop, ...data];
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
        const profileRef = this.$fire.database.ref(
            "/member/profile/" + this.state.profile.userId
        );

        try {
            const snapshot = await profileRef.once("value");
            if (snapshot.exists()) {
                commit("SET_REGISTER", snapshot.val());
                // TO DO
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
            }
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
        const { userID, auth } = await this.$auth.$storage.getLocalStorage(
            "authenticated"
        );

        console.log(userID);

        const thaichanaUserRef = this.$fire.database.ref(
            `/member/thaichana/${userID}/`
        );

        try {
            const snapshot = await thaichanaUserRef.once("value");
            if (snapshot.exists()) {
                let myShops = [];
                snapshot.forEach(childSnapshot => {
                    myShops.push({
                        appId: childSnapshot.val().appId,
                        businessType: childSnapshot.val().businessType,
                        canCheckin: childSnapshot.val().canCheckin,
                        shopId: childSnapshot.val().shopId,
                        status: childSnapshot.val().status,
                        subcategory: childSnapshot.val().subcategory,
                        title: childSnapshot.val().title
                    });
                });
                console.log(myShops);
                commit("SET_THAICHANA", myShops);
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
    async setThaichanaShop({ commit }, data) {
        const thaichanaUserRef = this.$fire.database.ref(
            `/member/thaichana/${this.state.profile.userId}`
        );
        try {
            thaichanaUserRef.push().set(data);
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
    }
};