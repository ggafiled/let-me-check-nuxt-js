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
  }
};
