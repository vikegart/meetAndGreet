<template>
    <v-container fluid pa-0 class="metoo-event-container">
        <v-flex xs12 md6 lg6>
            <v-layout row wrap pt-3 pb-3 pl-0 pr-0>
                <v-btn icon @click="$root.$router.back();">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
            </v-layout>


            <v-layout row wrap>
                <v-card class="metoo-event-info-card">
                    <v-card-media
                            class="white--text"
                            height="260px"
                            :src="event.src | scrFormatter">
                    </v-card-media>
                    <v-card-title class="metoo-card-info-title pl-3 pr-3">
                        <v-flex xs12 row>
                            <v-layout row>
                                <div class="metoo-cart-info-header-left-indent"></div>
                                <v-flex xs12 md10>
                                    <h3 class="metoo-cart-info-header" > {{ event.title }} </h3>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-layout row>
                            <div class="metoo-event-info-card-title-left-panel">
                                <p class="metoo-cart-info-date-text"> {{event.startDate | dateFormatter }}  </p>
                                <p class="metoo-cart-info-day-of-week-text"> {{event.startDate | dayOfWeekFormatter }} </p>
                                <p class="metoo-cart-info-time-text "> {{event.startTime}} </p>
                                <br />
                                <p class="metoo-cart-info-price body-2 mb-0">{{event.price | priceFormatter}}</p>
                                <p class="text-sm-left metoo-cart-info-location">{{ event.location }} </p>
                            </div>
                            <v-flex xs10 row>
                                <p class="text-sm-left metoo-cart-info-description">{{ event.description | descriptionFormatter}} </p>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12>
                            <v-btn icon class="ml-0 mr-0 metoo-card-info-icons" @click="toggleFavoriteEvent(event)">
                                <v-icon large :class="{ 'orange--text': event.isFavorites }">
                                    {{ event.isFavorites | favoriteIcon }}
                                </v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-title>
                </v-card>
            </v-layout>
        </v-flex>
    </v-container>

</template>



<script>
    import moment from 'moment';
    /*import api from '../../api';*/

    export default {
        name: 'event',
        data: () => ({
            event: {},
        }),
        filters: {
            scrFormatter: function (date) {
                if (date === undefined) { return ''}
                return date;
            },
            favoriteIcon: function (date) {
                if (date) {
                    return 'star';
                } else {
                    return 'star_border'
                }
            },
            priceFormatter: function (date) {
                if (date === null || date === undefined) {
                    return "";
                }
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
            },
            descriptionFormatter: function (date) {
                if (date === undefined) {
                    return ""
                }
                if (date.length == 0 || date === null) {
                    return "Описание отсутствует"
                }
                return date;
            }
        },
        methods: {
            loadEvent: function () {
                if (this.$root.$route.name == "event") {
                    scrollTo(0,20);
                    let emptyEvent = {
                        id: "-1",
                        title: 'Не нашли',
                        description:"Такой встречи нет. Не повезло. " ,
                        src: 'https://pp.userapi.com/c836324/v836324134/655b0/VlgO6dfohc8.jpg'
                    };

                    let id = this.$root.$route.params.id;
                    if (id !== undefined) {

                       /* // Пробуем получит эвент из нашего списка сначала, это быстрее
                        let event  = this.$root.$store.getters.getEventById(id);
                        if (event !== undefined) { this.event = event }*/

                        // после уже делаем запрос на сервер за эвентом и заодно пишем историю
                        let csrf = this.$root.$store.state.system.csrf.content;
                        api.events.getEvent(id, {headers: {'X-XSRF-TOKEN': csrf }} ).then(
                            response => { // success callback
                                let event = JSON.parse(response.bodyText);
                                event.startDate = moment(event.startDate, "DD.MM.YY");
                                this.event = event;
                            },
                            response => { // error callback
                                console.log("Error get event ");
                                console.log(response);

                                if (event === undefined) {
                                    this.event = emptyEvent
                                }
                            }
                        );
                    }
                }
            }
        },
        watch: {
            '$route': 'loadEvent' // в случае изменения маршрута запрашиваем данные вновь
        },
        created () {
            this.loadEvent();
        }
    }
</script>


<style>
    .metoo-event-container {
        background-color: #f5f5f5;
    }

    /* CARD */
    .metoo-event-info-card {
        width: 100%;
        margin-bottom: 45px;
        box-shadow: 0 1px 5px 0px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.1), 0 1px 1px -2px rgba(0,0,0,.1);
        position: relative;
        min-width: 0;
        border-radius: 0px;
    }

    .metoo-card-info-title {
        padding-top: 20px;
        padding-bottom: 5px;
    }

    .metoo-event-info-card-title-left-panel {
        margin-right: 24px;
        width: 100px;
    }


    .metoo-cart-info-date-text {
        font-size: 12px !important;
        font-weight: 400;
        margin: 0;
        padding: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .metoo-cart-info-day-of-week-text {
        font-size: 52px !important;
        font-weight: 400;
        line-height: 1.00 !important;
        letter-spacing: -0.05em !important;
        padding: 0;
        margin: 0;
        margin-left: -2px;
    }

    .metoo-cart-info-time-text {
        font-size: 24px !important;
        font-weight: 400;
        line-height: 1 !important;
        /*letter-spacing: 0.02em !important;*/
        margin: 0;
        padding: 0;
    }

    .metoo-cart-info-header {
        margin-top: 20px;
        margin-bottom: 20px;
        padding: 0px;
        font-size: 26px!important;
        font-weight: 400;
        line-height: 26px!important;
        letter-spacing: normal!important;
    }

    .metoo-cart-info-header-left-indent {
        display: none;
    }

    @media (min-width: 760px) {
        .metoo-cart-info-header-left-indent {
            margin-right: 38px;
            padding-top: 4px;
            width: 100px;
            display: block;
        }
    }
    @media (min-width: 960px) {
        .metoo-cart-info-header-left-indent {
            margin-right: 23px;
            padding-top: 4px;
            width: 100px;
            display: block;
        }
    }

    .metoo-cart-info-description {
        font-size: 16px !important;
        word-break: break-all;
        word-break: break-word;
        line-height: 1.20;
        font-weight: 400;
        white-space: pre-wrap;
    }

    .metoo-cart-info-location {
        font-size: 14px !important;
        line-height: 1.20;
        font-weight: 400;
    }

    .metoo-card-info-icons {
        float: right;
    }

    .metoo-cart-info-price {
        background-color: antiquewhite;
        padding-left: 5px;
        margin-left: -5px;
    }
</style>
