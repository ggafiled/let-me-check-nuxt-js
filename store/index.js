export const state = () => ({
  dialog: {
    isShow: false,
    title: "",
    message: ""
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
    myshop: [
      { header: "History" },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Brunch this weekend?",
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Oui oui",
        subtitle:
          '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?'
      }
    ],
    history: []
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
    state.thaichana = {
      ...state.thaichana,
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
        commit("localStorage/SET_AUTH", {
          userID: this.state.profile.userId,
          auth: true
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
    const thaichanaUserRef = this.$fire.database.ref(
      "/member/thaichana/" + this.state.profile.userId
    );
    try {
      const snapshot = await thaichanaUserRef.once("value");
      if (snapshot.exists()) {
        commit("SET_THAICHANA", snapshot.val());
      }
    } catch (e) {
      commit("SET_DIALOG", {
        isShow: true,
        title: "Thaichana history error",
        message: e.message
      });
      return;
    }
  }
};
