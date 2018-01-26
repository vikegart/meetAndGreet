<template>
    <div>
        <div class="metoo-filter-container">

            <v-flex xs12 md6 lg4 class="pl-3 pr-3 pt-4">
                <v-text-field  solo v-model="findFinlter" label=""  prepend-icon="search"> </v-text-field>
                <div class="metoo-card-search-description">найти встречу по названию</div>
            </v-flex>

            <v-flex xs12 md6 lg4 class="pl-0 pr-3">
                <v-layout row wrap class="light--text" >
                    <v-flex xs12 sm12 class="pt-4">
                        <v-checkbox label="Только бесплатные" hide-details v-model="freeOnly" class="metoo-filter-checkbox pt-0"></v-checkbox>
                    </v-flex>
                </v-layout>
            </v-flex>
        </div>

        <v-container fluid pa-0 class="metoo-events-container">
            <v-layout row wrap>
                <v-flex xs12 md6 lg4 style="margin-bottom: 100px;">
                  <v-flex class="metoo-event-card">
                    <v-progress-circular v-show="eventsIsLoad" indeterminate :size="220" :width="3" color="primary" style="position: initial"></v-progress-circular>
                  </v-flex>
                    <v-flex v-for="event in events" :key="event.title">
                        <v-card class="metoo-event-card" :id="event.id">
                            <div @click="switchPage('/event/' + event.id )">
                                <v-card-media
                                        class="white--text"
                                        height="200px"
                                        :src="event.src">
                                </v-card-media>
                                <v-card-title class="metoo-card-title pl-0 pr-0">
                                    <v-layout row>
                                        <div class="metoo-event-card-title-date">
                                            <p class="metoo-cart-date-text"> {{event.startDate}}  </p>
                                            <p class="metoo-cart-day-of-week-text">{{event.startDate | dayOfWeekFormatter}}</p>
                                            <p class="metoo-cart-time-text "> {{event.startTime}} </p>
                                        </div>
                                        <v-flex class="metoo-event-card-title-info">
                                            <div class="metoo-event-card-title-info-text mb-0 mt-0" > {{event.title}} </div>
                                            <p class="text-sm-left subheading grey--text">{{event.price | priceFormatter}}</p>
                                        </v-flex>
                                    </v-layout>
                                </v-card-title>
                            </div>
                        </v-card>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>



<script>
    import moment from 'moment';

    export default {
        name: 'find-event',
        data: () => ({
            interval: {},
            findFinlter: "",
            modal: false,
            freeOnly: false,
            cachedScroll: null,
            eventsIsLoad: true,
            allEvents: [],
        }),
        computed: {
            events: function() {
                let events = this.allEvents;

                return events.filter(function (event) {
                    let flag = true;
                    flag = flag && (!this.freeOnly || event.price == 0); // либо нет флага что бесплатно, либо цена равно 0

                    let searchFilter = this.findFinlter;
                    if (searchFilter != "") {
                        searchFilter = searchFilter.toLowerCase();
                        flag = flag && (event.title.toLowerCase().indexOf(searchFilter) !== -1);
                    }

                    return flag;
                }, this)// передаем vue экземпляр для callback
            },


        },
        filters: {
            priceFormatter: function (date) {
                return (date == 0 ? "Бесплатно" : date  + "р");
            },
            dayOfWeekFormatter: function (date) {
                if (date !== undefined) {

                    let cDate = moment(date, "DD.MM.YYYY");
                    return cDate.locale('ru').format('dd').toUpperCase();
                }
            },
            dateFormatter: function (date) {
                if (date !== undefined) {
                    let cDate = date.clone();
                    return cDate.locale('ru').format('D MMMM');
                }
            }
        },
        methods: {
            loadEvents: function() {
              this.$http.get('/events').then(response => { //TODO: указать норм путь при деплое
                let getEvents = JSON.parse(response.bodyText);
                let eventsArray = getEvents._embedded.events;
                this.eventsIsLoad = false;
                this.allEvents  = eventsArray;


              }, response => {
                console.log(' err response begin')
                console.log(response)
                console.log(' err response ending')

                this.eventsIsLoad = false;

                /*if (this.allEvents.length == 0){ //TODO: если на странице нет ивентов, и с сервера плохой ответ
                  let emptyEvent = {
                    id: "-1",
                    title: 'Что-то с сервером',
                    description:"С твоим сервером что-то не так" ,
                    src: 'https://pp.userapi.com/c836324/v836324134/655b0/VlgO6dfohc8.jpg'
                  };
                  this.allEvents = [emptyEvent]
                }*/
              });
            },

            switchPage: function(link) {
                this.$root.$router.push({ path: link });
            },
            scrollPage: function () {
                if (this.$root.$route.name == "find") {
                    scrollTo(0,this.cachedScroll);
                }
            }
        },
        watch: {
            '$route': 'scrollPage' //когда мы вернулись сюда с другой страницы (изменился маршрут)
        },

        beforeDestroy () {
          clearInterval(this.interval)
        },

        mounted () {
          this.interval = setInterval(() => {
            this.loadEvents();
          }, 3000)
        },
        beforeRouteLeave (to, from, next) { //когда уходим со страницы, сохраняем текущий скролл
            this.cachedScroll = window.pageYOffset;
            next();
        }
    }
</script>

<style src="../css/Events.css"></style>
