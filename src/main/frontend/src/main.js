import Vue from 'vue'
import App from './components/App.vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import VueResource from 'vue-resource'

import FindEvent from './components/pages/FindEvent.vue'
import CreateEvent from './components/pages/CreateEvent.vue'
import Event from './components/pages/Event.vue'
import About from './components/pages/About.vue'

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
            name: 'about',
            path: '/about',
            components: {default: About}
        }
    ]
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
