import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import users from './modules/users'
import events from './modules/events'
import system from './modules/system'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        users,
        events,
        system
    },
    strict: debug
})