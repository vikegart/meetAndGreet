import Vue from 'vue'
import App from './components/App.vue'
import VueRouter from 'vue-router'
import store from './store'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import VueResource from 'vue-resource'

import FindEvent        from './components/pages/FindEvent.vue'
import FavoriteEvents   from './components/pages/FavoriteEvents.vue'
import HistoryEvents    from './components/pages/HistoryEvents.vue'
import CreateEvent      from './components/pages/CreateEvent.vue'
import MyEvent          from './components/pages/MyEvent.vue'
import Event            from './components/pages/Event.vue'

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(VueResource);

let router = new VueRouter({
    routes: [
        {
            name: 'find',
            path: '/',
            components: { default: FindEvent }
        }, {
            name: 'create',
            path: '/create',
            components: { default: CreateEvent }
        }, {
            name: 'event',
            path: '/event/:id',
            components: { default: Event}
        }, {
            name: 'favorites',
            path: '/favorite',
            components: { default: FavoriteEvents }
        }, {
            name: 'history',
            path: '/history',
            components: { default: HistoryEvents }
        }

    ]
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
