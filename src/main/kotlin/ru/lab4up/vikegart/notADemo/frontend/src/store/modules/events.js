import * as types from '../mutation-types'
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import api from '../../api'

Vue.use(VueResource);
Vue.use(VueRouter);

import moment from 'moment';

// initial state
const state = {
    events: [],
    favorites: [],
    history: []
};

// getters
const getters = {
    getEventById: function(state) {
        return function (id) {
            let event = state.events.find(event => event.id == id);
            if (event === undefined) { event = state.history.find(event => event.id == id); }
            if (event === undefined) { event = state.favorites.find(event => event.id == id); }
            return event;
        }
    }
};

// actions
const actions = {
    loadEvents ({ commit, state, rootGetters }) {
        let params = {
            dateFrom: moment().add(-1, 'weeks').set({'hour': 0, 'minute': 0}).format('DD.MM.YY HH:mm'),
            dateTo: moment().add(+3, 'weeks').set({'hour': 23, 'minute': 59}).format('DD.MM.YY HH:mm'),
        };

        let csrf = rootGetters.getCSRF;

        api.events.searchEvents({params: params, headers: {'X-XSRF-TOKEN': csrf }} ).then(
            response => { // success callback
                let events = JSON.parse(response.bodyText);
                events.forEach( function (value) {
                   value.startDate = moment(value.startDate, "DD.MM.YY");
                });
                commit('EVENTS_SET', events);
            },
            response => { // error callback
                console.log("Error get events ")
                console.log(response);
                state.events == null;
            }
        );
    },
    /*loadHistory ({ commit, state, rootGetters }) {
        let csrf = rootGetters.getCSRF;

        api.events.getHistory({headers: {'X-XSRF-TOKEN': csrf }} ).then(
            response => { // success callback
                let events = JSON.parse(response.bodyText);
                events.forEach( function (value) {
                    value.startDate = moment(value.startDate, "DD.MM.YY");
                });
                commit('EVENTS_HISTORY_SET', events);
            },
            response => { // error callback
                console.log("Error get history ")
                console.log(response);
                state.history == null;
            }
        );
    },*/
    /*loadFavorites ({ commit, state, rootGetters }) {
        let csrf = rootGetters.getCSRF;
        // let csrf_name = rootGetters.getCSRF_NAME;
        api.events.getFavorites({headers: {'X-XSRF-TOKEN': csrf }} ).then(
            response => { // success callback
                let events = JSON.parse(response.bodyText);
                events.forEach( function (value) {
                    value.startDate = moment(value.startDate, "DD.MM.YY");
                });
                commit('EVENTS_FAVORITES_SET', events);
            },
            response => { // error callback
                console.log("Error get favorites ")
                console.log(response);
                state.favorites == null;
            }
        );
    },*/
    /*toggleFavoriteEvent ({ commit, state, rootGetters }, event) {
        if (!event.isFavorites) {
            let csrf = rootGetters.getCSRF;
            // let csrf_name = rootGetters.getCSRF_NAME;
            api.events.addToFavorites(event.id, {headers: {'X-XSRF-TOKEN': csrf}}).then(
                response => { // success callback
                    let event = JSON.parse(response.bodyText);
                    event.startDate = moment(event.startDate, "DD.MM.YY");
                    commit('EVENT_SET', event);
                },
                response => { // error callback
                    console.log("Error add to favorites ");
                    console.log(response);
                }
            );
        } else
        if (event.isFavorites) {
            let csrf = rootGetters.getCSRF;
            // let csrf_name = rootGetters.getCSRF_NAME;
            api.events.deleteFromFavorites(event.id, {headers: {'X-XSRF-TOKEN': csrf}}).then(
                response => { // success callback
                    let event = JSON.parse(response.bodyText);
                    event.startDate = moment(event.startDate, "DD.MM.YY");
                    commit('EVENT_SET', event);
                },
                response => { // error callback
                    console.log("Error delete to favorites ");
                    console.log(response);
                }
            );
        }
    },*/

    /*leadEvent({ rootGetters }, event) { //эту функцию никто не вызывает?
        let csrf = rootGetters.getCSRF;
        // let csrf_name = rootGetters.getCSRF_NAME;
        api.events.getEvent(event.id, {headers: {'X-XSRF-TOKEN': csrf }} ).then(
            response => { // success callback
                // нечего не делаем , событие добавилось к нам в список истории
            },
            response => { // error callback
                console.log("error create event");
                console.log(response);
            }
        );
    },*/
    /*createEvents({ rootGetters, dispatch }, event) {
        let csrf = rootGetters.getCSRF;
        api.events.createEvent(event, {headers: {'X-XSRF-TOKEN': csrf }} ).then(
            response => { // success callback
                dispatch('loadEvents');
                /!*let event = JSON.parse(response.bodyText);
                console.log(event.id); получили id, осталось редирек~*!/
                // TODO 28.09.2017 тут добавить vue-router reload на страницу созданного мероприятия
            },
            response => { // error callback
                console.log("error create event");
                console.log(response);
            }
        );
    }*/
};

// mutations
const mutations = {

    // TODO 30.10.17 это пока костыль, переписать как будет время  !
    [types.EVENT_SET] (state, event) {
        {
            let ind = state.events.findIndex((ev) => (ev.id == event.id));
            if (ind == -1) { state.events.push(event); }
            else {
                let events = state.events.slice();
                events[ind] = event;
                state.events = events;
            }
        } {
            let ind = state.favorites.findIndex((ev) => (ev.id == event.id));
            let events = state.favorites.slice();
            events[ind] = event;
            state.favorites = events;
        } {
            let ind = state.history.findIndex((ev) => (ev.id == event.id));
            let events = state.history.slice();
            events[ind] = event;
            state.history = events;
        }
    },


    [types.EVENTS_SET] (state, events) {
        state.events = events;
    },
    [types.EVENTS_HISTORY_SET] (state, events) {
        state.history = events;
    },
    [types.EVENTS_FAVORITES_SET] (state, events) {
        state.favorites = events;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}