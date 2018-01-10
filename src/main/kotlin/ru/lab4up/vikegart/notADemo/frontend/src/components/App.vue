<template>
    <v-app id="metoo" v-scroll="onScroll">
        <!--<v-progress-linear-->
                <!--style="z-index: 5000; position: fixed"-->
                <!--v-bind:indeterminate="query"-->
                <!--v-bind:query="true"-->
                <!--v-model="value"-->
                <!--v-bind:active="show"-->
        <!--&gt;</v-progress-linear>-->



        <v-navigation-drawer
            clipped
            persistent
            v-model="drawer"
            enable-resize-watcher
            app
            light
            enable-resize-watcher
            :mobileBreakPoint="590"
            class="metoo-bg-light--grey">

        <!--<v-navigation-drawer app-->
                <!--persistent-->
                <!--clipped-->
                <!--light-->
                <!--v-model="drawer"-->
                <!--overflow-->
                <!--enable-resize-watcher-->
                <!--:mobileBreakPoint="590"-->
                <!--class="metoo-bg-light&#45;&#45;grey">-->

            <v-list dense class="pt-0 pr-3 metoo-bg-light--grey">
                <div style="height: 20px"></div>


              <template v-for="(item, i) in items">
                <v-layout v-if="item.heading" row align-center :key="i">
                  <v-flex xs6>
                    <v-subheader v-if="item.heading">
                      {{ item.heading }}
                    </v-subheader>
                  </v-flex>
                </v-layout>

                <v-divider v-else-if="item.divider" dark class="my-3" :key="i"> </v-divider>

                <v-list-tile :key="i" v-else @click="switchPage(item.path)">
                  <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title class="grey--text text--darken-2"> {{ item.title }} </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>



                <div class="warning-info-text">
                    Ошибки и предложения пишите сюда <a href="http://vk.com/metoo_saratov"> vk.com/metoo_saratov </a>
                </div>

            </v-list>
        </v-navigation-drawer>


        <!--<v-toolbar app fixed class="cyan darken-1" dark>-->
        <v-toolbar app fixed clipped-left class="cyan darken-1" dark>
            <div class="hidden-sm-and-up" style="margin-left: 3px;">
                <v-toolbar-side-icon @click.stop="leftMenuToggle"></v-toolbar-side-icon>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon large> account_circle </v-icon>
            </v-btn>
            <div class="metoo-toolbar-title"> {{$root.$store.state.system.title}} </div>
        </v-toolbar>

        <main>
            <v-content>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </v-content>
        </main>
        <v-fab-transition>
            <v-btn style="bottom: 30px"
                   absolute
                   dark
                   fab
                   fixed
                   bottom
                   right
                   v-show="showBtnUp"
                   class='cyan darken-1'
                   v-on:click="scrollToTop"
                   >
                <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
        </v-fab-transition>
    </v-app>
</template>


<script>

    import api from '../api';

    export default {
        data: () => ({
            items: [
                { title: 'Найти встречу',    path: '/',         icon: 'place' },
                { divider: true },
                { title: 'Просмотренное',    path: '/history',  icon: 'history' },
                { title: 'Избранное',        path: '/favorite', icon: 'grade' },
                { title: 'Созданное',        path: '/',         icon: 'edit_location', role: 'ROLE_CREATOR'},
                { divider: true, role: 'ROLE_CREATOR'},
                { title: 'Создать встречу',  path: '/create',   icon: 'edit', role: 'ROLE_CREATOR' },
                { divider: true },
            ],
            showBtnUp: false,
            offsetTop: 0,
            value: 0, /*для прогрессбара*/
            query: false, /*для прогрессбара*/
            show: true,
            interval: {}

        }),
        computed: {
            user: function () {
                return this.$root.$store.state.users.user;
            },
            drawer: {
                get: function () {
                    return this.$root.$store.state.system.drawer;
                },
                set: function (value) {
                    this.flag = this.$root.$store.commit('LEFT_PANEL_DRAWER_TOGGLE', value);
                }
            },
            isNotAuthUser: function(){
                return (this.user === null);
            }
        },

        methods: {
            scrollToTop: function () {
                window.scroll({ top: 0, left: 0, behavior: 'smooth' });
            },
            onScroll (e) {
                this.offsetTop = window.pageYOffset;
                if (this.offsetTop>=280){
                    this.showBtnUp = true
                }
                else this.showBtnUp = false
            },
            queryAndIndeterminate () {
                this.query = true
                this.show = true
                this.value = 0
                let int

                this.query = false

                this.interval = setInterval(() => {
                    if (this.value === 100) {
                        clearInterval(this.interval)
                        this.show = false
                        return setTimeout(this.queryAndIndeterminate, 2000)
                    }
                    this.value += 25
                }, 1000)
            },
            switchPage: function(link) {
                scrollTo(0,0);
                this.$root.$router.push({ path: link });
            },
            leftMenuToggle: function () {
                this.$root.$store.commit('LEFT_PANEL_DRAWER_TOGGLE', !this.$root.$store.state.system.drawer)
            },

            logout: function() {
                /*this.$root.$store.dispatch('logout');*/
                let csrf = this.$root.$store.state.system.csrf.content;
                api.users.logout( {headers: {'X-XSRF-TOKEN': csrf }} ).then(
                    response => { // success callback
                        this.$root.$store.commit('USER_CLEAR');
                    },
                    response => { // error callback
                        console.log("Logout Error ");
                        console.log(response);
                    }
                );
            },

            checkRole: function (role) {
                if (role === undefined || role === null || this.user.roles.findIndex((v) => (v == role)) != -1) {
                    return true;
                }
                return false;
            }
        },
        beforeDestroy () {
            clearInterval(this.interval)
        },
        mounted: function() {
            /*this.$root.$store.dispatch('checkAuthUser');*/
            let csrf = this.$root.$store.state.system.csrf.content;
            api.users.getCurrentUser({headers: {'X-XSRF-TOKEN': csrf }} ).then(
                response => { // success callback
                    let user = JSON.parse(response.bodyText);
                    this.$root.$store.commit('USER_SET', user);
                },
                response => { // error callback
                    this.$root.$store.commit('USER_CLEAR');
                }
            );
            // TODO 28.09.17 тут надо добавить работу со спинером, пока все это грузится
            this.queryAndIndeterminate()
        }

    }
</script>

<style>
    .navigation-drawer__border {
        display: none
    }

    .metoo-toolbar-title {
        margin-right: 20px;
        margin-left: 0px;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .metoo-bg-light--grey {
        background-color:#f5f5f5 !important;
    }

    .application--light {
        background: #f5f5f5;
        color: rgba(0,0,0,0.87);
    }

    .metoo-login-description {
        padding: 16px;
        margin-top: 0px;
        padding-left: 40px;
        font-size: 14px;
        padding-top: 0px;
        line-height: 18px;
    }


    .warning-info-text {
        margin: 20px;
        margin-left: 35px;
        padding: 8px;
        line-height: 1.2;
        font-size: 13px;
        background: antiquewhite;
    }
</style>
