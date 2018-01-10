import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

export const getEvent = (eventId, params) => {
    return Vue.http.get('/events/event/' + eventId, params);
};

export const searchEvents = (params) => {
    return Vue.http.get('/events/saratov/find', params);
};

export const getHistory = (params) => {
    return Vue.http.get('/events/history', params);
};

export const getFavorites = (params) => {
    return Vue.http.get('/events/favorites', params);
};

export const addToFavorites = (eventId, params) => {
    return Vue.http.post('/events/add-favorite/' + eventId, {},  params);
};

export const deleteFromFavorites = (eventId, params) => {
    return Vue.http.post('/events/delete-favorite/' + eventId, {},  params);
};

export const createEvent = (event, params) => {
    return Vue.http.post('/events/create', event,  params);
};