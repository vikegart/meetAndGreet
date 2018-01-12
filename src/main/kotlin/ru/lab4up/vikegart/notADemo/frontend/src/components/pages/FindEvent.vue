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
                                            <p class="metoo-cart-day-of-week-text">ПН</p>
                                            <p class="metoo-cart-time-text "> {{event.startTime}} </p>
                                        </div>
                                        <v-flex class="metoo-event-card-title-info">
                                            <div class="metoo-event-card-title-info-text mb-0 mt-0" > {{event.title}} </div>
                                            <p class="text-sm-left subheading grey--text">{{event.price}}</p>
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
    /*import api from '../../api';*/

    export default {
        name: 'find-event',
        data: () => ({
            findFinlter: "",
            dateFrom:   (moment().day() == 0 ? moment().day(-6) : moment().day(1)), // по умолчанию на текущую неделю будет
            dateTo:     (moment().day() == 0 ? moment() : moment().day(7)),
            modal: false,
            freeOnly: false,
            alertAboutLogin: false,
            cachedScroll: null,
            dataPickerDialog: false,
            picker: null,
            events: [],
        }),
        computed: {
            events: function() {
                let events = this.$root.$store.state.events.events;

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
            scrollPage: function () {
                if (this.$root.$route.name == "find") {
                    scrollTo(0,this.cachedScroll);
                }

            }
        },
        watch: {
            '$route': 'scrollPage' //когда мы вернулись сюда с другой страницы (изменился маршрут)
        },
        created () {
          this.$http.get('http://127.0.0.1:8033/events').then(response => {
            let getEvents = JSON.parse(response.bodyText);
            console.log(getEvents);
            console.log(getEvents.content);
            this.events  = getEvents.content;
            // get body data


          }, response => {
            console.log(' err response begin')
            console.log(response)
            console.log(' err response ending')
          });
            /*this.$root.$store.dispatch('loadEvents');*/ //TODO 6.10.17 Вынести в отдельный API?

        },
        beforeRouteLeave (to, from, next) { //когда уходим со страницы, сохраняем текущий скролл
            this.cachedScroll = window.pageYOffset;
            next();
        }
    }
</script>

<style src="../css/Events.css"></style>
