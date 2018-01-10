import * as types from '../mutation-types'

// initial state
const state = {
    drawer: true,
    title: 'MeToo (alfa)',
    csrf: document.head.querySelector("[name=_csrf]"),
    // csrf_name: document.head.querySelector("[name=__csrf_header"), TODO 01.10.17 по хорошему это надо заюзать а не напрямую имя токена давать
    loader: {
        value: 0
    }
};

// getters
const getters = { };

// actions
const actions = {
    // getAllProducts ({ commit }) {
    //     shop.getProducts(products => {
    //         commit(types.RECEIVE_PRODUCTS, { products })
    //     })
    // }
};

// mutations
const mutations = {
    [types.LEFT_PANEL_DRAWER_TOGGLE] (state, value) {
        state.drawer = value;
    }
    //
    // [types.ADD_TO_CART] (state, { id }) {
    //     state.all.find(p => p.id === id).inventory--
    // }
};

export default {
    state,
    getters,
    actions,
    mutations
}