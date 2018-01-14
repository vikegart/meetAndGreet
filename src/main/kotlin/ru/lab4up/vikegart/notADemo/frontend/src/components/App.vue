<template>
  <v-app id="inspire" v-scroll="onScroll">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile @click="switchPage('/')">
          <v-list-tile-action>
            <v-icon>place</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Найти встерчу</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="switchPage('/create')">
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Создать встречу</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="/greeting">
          <v-list-tile-action>
            <v-icon>edit_location</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>http</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="/events">
          <v-list-tile-action>
            <v-icon>edit_location</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>events</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Meet&Greet</v-toolbar-title>
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
             class='indigo'
             v-on:click="scrollToTop"
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; course project. 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      showBtnUp: false,
      offsetTop: 0,
    }),

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
      switchPage: function(link) {
        scrollTo(0,0);
        this.$root.$router.push({ path: link });
      },
    }
  }
</script>
