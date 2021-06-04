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
        commit("SET_AUTH", data);
    }
};