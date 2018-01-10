<template>
    <div>
        <div class="metoo-filter-container">

            <v-flex xs12 md6 lg4 class="pl-3 pr-3 pt-4">
                <div class="metoo-container-main-title-favorite">Закладки</div>
            </v-flex>

            <v-flex xs12 md6 lg4 class="pl-3 pr-3 pt-4">
                <v-text-field  solo v-model="findFinlter" label=""  prepend-icon="search"> </v-text-field>
                <div class="metoo-card-search-description">найти встречу по названию</div>
            </v-flex>

            <v-flex xs12 md6 lg4 class="pl-0 pr-3">
                <v-layout row wrap class="light--text" >
                    <v-flex xs12 sm12 class="pt-4">
                        <v-checkbox label="Только бесплатные" hide-details v-model="freeOnly" class="metoo-filter-checkbox pt-0"></v-checkbox>
                    </v-flex>
                    <v-flex xs12 sm12 style="margin-top: -5px">
                        <v-menu>
                            <div slot="activator">
                                <v-btn icon class="metoo-filter-date-btn"> <v-icon>event</v-icon> </v-btn>
                                <span style="color: rgba(0, 0, 0, 0.68); font-size: 14px;">
                                      {{chosenDate}} <v-icon>arrow_drop_down</v-icon>
                                </span>
                            </div>
                            <v-list>
                                <v-list-tile @click="onToday">
                                    <v-list-tile-title>На сегодня</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="onTomorrow">
                                    <v-list-tile-title>На завтра</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="onWeekends">
                                    <v-list-tile-title>На выходные</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="onCurrWeek">
                                    <v-list-tile-title>На эту неделю</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="onNextWeek">
                                    <v-list-tile-title>На след. неделю</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="">
                                    <v-dialog
                                            persistent
                                            v-model="modal"
                                            lazy
                                            full-width>
                                        <v-list-tile-title slot="activator">выбрать дату... </v-list-tile-title>
                                        <v-date-picker
                                                v-model="datePicked"
                                                scrollable
                                                first-day-of-week="1"
                                                locale="ru-RU"
                                                > <!--autosave убрал, так как есть кнопки-->
                                            <template scope="{ save, cancel }">
                                                <v-card-actions>
                                                    <v-btn flat primary @click.native="save()">Сохранить</v-btn>
                                                </v-card-actions>
                                            </template>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </v-flex>
                </v-layout>
            </v-flex>
        </div>

        <v-container fluid pa-0 class="metoo-events-container">
            <v-layout row wrap>
                <v-flex xs12 md6 lg4  style="margin-bottom: 100px;">
                    <v-flex v-for="event in events" :key="event.title">
                        <v-card class="metoo-event-card">
                            <div @click="switchPage('/event/' + event.id )">
                                <v-card-media
                                        class="white--text"
                                        height="200px"
                                        :src="event.src">
                                </v-card-media>
                                <v-card-title class="metoo-card-title pl-0 pr-0">
                                    <v-layout row>
                                        <div class="metoo-event-card-title-date">
                                            <p class="metoo-cart-date-text"> {{event.startDate | dateFormatter }}  </p>
                                            <p class="metoo-cart-day-of-week-text"> {{event.startDate | dayOfWeekFormatter }} </p>
                                            <p class="metoo-cart-time-text "> {{event.startTime}} </p>
                                        </div>
                                        <v-flex class="metoo-event-card-title-info">
                                            <div class="metoo-event-card-title-info-text mb-0 mt-0" > {{event.title}} </div>
                                            <p class="text-sm-left subheading grey--text">{{event.price | priceFormatter}}</p>
                                        </v-flex>
                                    </v-layout>
                                </v-card-title>
                            </div>
                            <v-card-actions class="white pt-0 pb-2 pr-1">
                                <v-spacer></v-spacer>
                                <v-btn icon @click="toggleFavoriteEvent(event)">
                                    <v-icon medium :class="{ 'orange--text': event.isFavorites }">
                                        {{ event.isFavorites | favoriteIcon }}
                                    </v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>



<script>
    import moment from 'moment';
    import api from '../../api'

    export default {
        name: 'find-event',
        data: () => ({
            findFinlter: "",
            dateFrom:   (moment().day() == 0 ? moment().day(-6) : moment().day(1)), // по умолчанию на текущую неделю будет
            dateTo:     (moment().day() == 0 ? moment() : moment().day(7)),
            modal: false,
            freeOnly: false,
            cachedScroll: null
        }),
        computed: {
            events: function() {
                let events = this.$root.$store.state.events.favorites;

                return events.filter(function (event) {
                    let flag = true;
                    flag = flag && (!this.freeOnly || event.price == 0); // либо нет флага что бесплатно, либо цена равно 0
                    flag = flag && (event.startDate.isSameOrBefore(this.dateTo, "date"));  // проверяем на дату начала
                    flag = flag && (event.startDate.isSameOrAfter(this.dateFrom, "date"));  // проверяем на дату конца

                    // TODO 22.09.17 пока сделана фильтрация только по названию, нужно добавить по тегам и мб по описанию.
                    let searchFilter = this.findFinlter;
                    if (searchFilter != "") {
                        searchFilter = searchFilter.toLowerCase();
                        flag = flag && (event.title.toLowerCase().indexOf(searchFilter) !== -1);
                    }

                    return flag;
                }, this)// передаем vue экземпляр для callback
            },

            datePicked : {
                get : function () {
                    return moment(this.dateFrom);
                },
                set : function (value) {
                    this.dateFrom = moment(value).add(12, 'h');
                    this.dateTo = moment(value).add(12, 'h');

                }
            },
            chosenDate : function () {
                let today = moment();
                let tomorrow = today.clone();
                tomorrow.date(tomorrow.date()+1);

                if (this.dateFrom.isSame(today, 'day') && this.dateTo.isSame(today, 'day')){
                    return 'На сегодня';
                } else
                if (this.dateFrom.isSame(tomorrow, 'day') && this.dateTo.isSame(tomorrow, 'day')){
                    return 'На завтра';
                } else
                if (this.dateFrom.day() == 6 && this.dateTo.day() == 0){ //если от субботы до вскр
                    return 'На выходные';
                } else
                if ((this.dateFrom.isSame(moment().day(1), 'day') // TODO
                    && this.dateTo.isSame(moment().day(7), 'day') && today.day() != 0)
                    || (today.day() == 0 && this.dateFrom.isSame(today.clone().day(-6), 'day') && !(this.dateFrom.isSame(this.dateTo, 'day')))){
                    return 'На эту неделю';
                } else
                if ((this.dateFrom.isSame(moment().day(1+7), 'day') // TODO
                    && this.dateTo.isSame(moment().day(7+7), 'day')
                    && today.day() != 0) ||
                    (today.day() == 0 && this.dateFrom.isSame(today.clone().day(1), 'day')
                    && !(this.dateFrom.isSame(this.dateTo, 'day')))) {
                    return 'На след. неделю';
                } else
                if (this.dateFrom.isSame(this.datePicked, 'day')
                    && this.dateTo.isSame(this.datePicked, 'day')){
                    this.dateFrom.locale('ru');
                    return this.dateFrom.format("ddd, D, MMMM")
                }
            }
        },
        filters: {
            favoriteIcon: function (date) {
                if (date) {     return 'star';
                } else {        return 'star_border'; }
            },
            priceFormatter: function (date) {
                return (date == 0 ? "Бесплатно" : date  + "р");
            },
            dayOfWeekFormatter: function (date) {
                if (date !== undefined) {
                    let cDate = date.clone();
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
            switchPage: function(link) {
                this.$root.$router.push({ path: link });
            },
            // For datePicker
            onToday: function () {
                this.dateFrom = moment();
                this.dateTo = this.dateFrom;
            },
            onTomorrow: function () {
                let today = moment();
                this.dateFrom = today.date(today.date()+1);
                this.dateTo = this.dateFrom;
            },
            onWeekends: function () {
                let today = moment();
                let yesterday = today.clone();
                yesterday.date(yesterday.date()-1);

                if (today.day() == 0){ //если сегодня воскресенье
                    this.dateFrom = yesterday;
                    this.dateTo = today;
                } else {
                    this.dateFrom = today.clone().day(6);
                    this.dateTo = today.clone().day(7);
                }
            },
            onCurrWeek: function () {
                let today = moment();

                if (today.day() == 0){ //если сегодня воскресенье
                    this.dateFrom = today.clone().day(-6);
                    this.dateTo = today;
                } else {
                    this.dateFrom = today.clone().day(1);
                    this.dateTo = today.clone().day(7);
                }
            },
            onNextWeek: function () {
                let today = moment();

                if (today.day() == 0){ //если сегодня воскресенье
                    this.dateFrom = today.clone().day(1);
                    this.dateTo = today.day(7);
                } else {
                    this.dateFrom = today.clone().day(1+7);
                    this.dateTo = today.clone().day(7+7);
                }
            },
            toggleFavoriteEvent: function (event) {
                /*this.$root.$store.dispatch('toggleFavoriteEvent', event);*/
                if (!event.isFavorites) {
                    let csrf = this.$root.$store.state.system.csrf.content;
                    api.events.addToFavorites(event.id, {headers: {'X-XSRF-TOKEN': csrf}}).then(
                        response => { // success callback
                            let event = JSON.parse(response.bodyText);
                            event.startDate = moment(event.startDate, "DD.MM.YY");
                            this.$root.$store.commit('EVENT_SET', event);
                        },
                        response => { // error callback
                            console.log("Error add to favorites ");
                            console.log(response);
                        }
                    );
                } else
                if (event.isFavorites) {
                    let csrf = this.$root.$store.state.system.csrf.content;
                    api.events.deleteFromFavorites(event.id, {headers: {'X-XSRF-TOKEN': csrf}}).then(
                        response => { // success callback
                            let event = JSON.parse(response.bodyText);
                            event.startDate = moment(event.startDate, "DD.MM.YY");
                            this.$root.$store.commit('EVENT_SET', event);
                        },
                        response => { // error callback
                            console.log("Error delete to favorites ");
                            console.log(response);
                        }
                    );
                }
            },


            loadFavorites: function () {
                if (this.$root.$route.name == "favorites") {
                    /*this.$root.$store.dispatch('loadFavorites');*/
                    let csrf = this.$root.$store.state.system.csrf.content;
                    api.events.getFavorites({headers: {'X-XSRF-TOKEN': csrf }} ).then(
                        response => { // success callback
                            let events = JSON.parse(response.bodyText);
                            events.forEach( function (value) {
                                value.startDate = moment(value.startDate, "DD.MM.YY");
                            });
                            this.$root.$store.commit('EVENTS_FAVORITES_SET', events);
                        },
                        response => { // error callback
                            console.log("Error get favorites ")
                            console.log(response);
                            state.favorites == null;
                        }
                    );
                    scrollTo(0,this.cachedScroll);

                }
            }
        },
        watch: {
            '$route': 'loadFavorites' // в случае изменения маршрута запрашиваем данные вновь
        },
        created () {
            this.loadFavorites();
        },
        beforeRouteLeave (to, from, next) { //когда уходим со страницы, сохраняем текущий скролл
            this.cachedScroll = window.pageYOffset;
            next();
        }
    }
</script>

<style src="../css/Events.css"></style>
<style>
    .metoo-container-main-title-favorite {
        font-size: 26px!important;
        font-weight: 400;
        line-height: 26px!important;
        letter-spacing: normal!important;
    }
</style>