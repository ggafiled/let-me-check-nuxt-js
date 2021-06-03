export const state = () => ({
  authenticated: {
    userId: "",
    auth: false
  }
});

export const mutations = {
  SET_AUTH(state, data) {
    state.authenticated = {
      ...state.authenticated,
      ...data
    };
  }
};

export const actions = {
  setAuthenticated({ commit }, data) {
    this.$cookies.set("userId", data.userId, {
      path: "/"
    });
    this.$cookies.set("auth", data.auth, {
      path: "/"
    });
    commit("SET_AUTH", data);
  }
};
