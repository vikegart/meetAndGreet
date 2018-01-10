import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);


/*
    return current user or error if user not login to system
 */
export const getCurrentUser = (params) => {
    return Vue.http.get('/user', params);
};


/*
    logout for user exit from system
 */
export const logout = (params) => {
    return Vue.http.get('/logout', params);
};