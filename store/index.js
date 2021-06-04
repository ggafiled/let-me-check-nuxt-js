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
        state.thaichana.myshop = {
            ...state.thaichana.myshop,
            ...data
        };
    },
    initialiseStore(state, data) {
        if (this.$auth.$storage.getCookie("authenticated")) {
            const { userId, auth } = JSON.parse(
                JSON.stringify(this.$auth.$storage.getCookie("authenticated"))
            );
            state.authenticated.userId = userId;
            state.authenticated.auth = Boolean(auth);
            console.log({
                origin: "initialiseStore",
                userId: state.authenticated.userId,
                auth: state.authenticated.auth
            });
        }
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
                this.$auth.$storage.setCookie(
                    "authenticated",
                    JSON.stringify({
                        userID: this.state.profile.userId,
                        auth: true
                    }),
                    true
                );

                commit("initialiseStore", {
                    userID: this.state.profile.userId,
                    auth: true
                });

                console.log(
                    JSON.stringify(this.$auth.$storage.getCookie("authenticated"))
                );
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
        const thaichanaUserRef = this.$fire.database.ref(
            `/member/thaichana/${this.state.profile.userId}`
        );
        try {
            const snapshot = await thaichanaUserRef.once("value");
            if (snapshot.exists()) {
                let myShop = [];
                snapshot.forEach(childSnapshot => {
                    myShop.push(childSnapshot.val());
                });
                commit("SET_THAICHANA", myShop);
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
    }
};
