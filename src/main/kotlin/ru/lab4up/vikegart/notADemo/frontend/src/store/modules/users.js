import * as types from '../mutation-types'
import api from '../../api'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);


// initial state
const state = {
    user: null
};

// getters
const getters = {

};

// actions
const actions = {
    /*checkAuthUser ({ commit, rootGetters }) {
        let csrf = rootGetters.getCSRF;
        api.users.getCurrentUser({headers: {'X-XSRF-TOKEN': csrf }} ).then(
            response => { // success callback
                let user = JSON.parse(response.bodyText);
                commit('USER_SET', user);
            },
            response => { // error callback
                commit('USER_CLEAR');
            }
        );
    },*/

    /*logout({ commit, rootGetters}) {
        let csrf = rootGetters.getCSRF;
        // let csrf_name = rootGetters.getCSRF_NAME;
        api.users.logout( {headers: {'X-XSRF-TOKEN': csrf }} ).then(
            response => { // success callback
                commit('USER_CLEAR');
            },
            response => { // error callback
                console.log("Logout Error ");
                console.log(response);
            }
        );
    }*/
};

// mutations
const mutations = {
    [types.USER_SET] (state, user) {
       state.user = user;
    },

    [types.USER_CLEAR] (state) {
        state.user = null;
    }
};


export default {
    state,
    getters,
    actions,
    mutations
}