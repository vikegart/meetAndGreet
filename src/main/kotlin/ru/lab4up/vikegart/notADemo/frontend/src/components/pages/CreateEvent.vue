<template>
    <v-container fluid>
        <div class="metoo-create-container">

            <v-card>
                <v-container grid-list-md>
                    <v-form v-model="valid" ref="form">
                    <v-layout row wrap>
                        <v-flex xs12 md7 lg5>
                            <div class="headline">Создание встречи</div>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12  md7 lg5>
                            <v-text-field
                                    box
                                    v-model="event.title"
                                    name="title"
                                    :counter="60"
                                    :rules="[ function() {return event.title != '' && event.title.length <= 60 || 'Сократите'}]"
                                    label="Название"
                                    hint="Название обязательно"
                                    persistent-hint>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12  md7 lg5>
                            <v-text-field
                                    box
                                    v-model="event.description"
                                    name="description"
                                    label="Описание"
                                    :counter="600"
                                    multi-line> <!--:rules="[ function() {return event.description.length <= 600 || 'Нужно уложиться в 600 символов'}]"-->
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md7 lg5 >
                            <v-text-field
                                    box
                                    v-model="event.src"
                                    :rules="[ function() {return ((/\.jpg|\.jpeg|\.png|\.gif/.test(event.src)) || event.src == '') || 'Допустимый формат jpeg, jpg, png, gif'}]"
                                    label="URL изображения "
                                    hint="Например https://i.imgur.com/GgUceLi.png"
                                    persistent-hint>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12  md7 lg5  >
                            <v-text-field
                                    box
                                    v-model="event.location"
                                    name="Адрес"
                                    label="Где будет встреча? Адрес">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md7 lg5 >
                            <v-text-field
                                    box
                                    v-model="event.price"
                                    :rules="[ function() {return event.price.length <= 42 || 'Нужно уложиться в 42 символа'}]"
                                    name="Стоимость"
                                    label="Стоимость участия">
                            </v-text-field>
                            <v-checkbox
                                    style="margin-top: -10px; padding-top: 0;"
                                    label="Бесплатно"
                                    v-model="event.price"
                                    false-value=""
                                    true-value="0"
                                    value="0">
                            </v-checkbox>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md3 lg2 >
                            <v-dialog v-model="startDateModal" lazy full-width>
                                <v-text-field
                                    slot="activator"
                                    label="Дата начала"
                                    prepend-icon="today"
                                    locale="ru-RU"
                                    v-model="event.startDate"
                                    :rules="[ function() {return (event.startDate !=null) || 'Выберите дату'}]"
                                    readonly>
                                </v-text-field>
                                <v-date-picker
                                    v-model="dataPickerDate"
                                    scrollable
                                    first-day-of-week="1"
                                    locale="ru-RU"
                                    :date-format="formatWithDots"
                                    :formatted-value.sync="event.startDate"
                                    :allowed-dates="dayTodayOrFuture">
                                        <template scope="{ save }">
                                            <v-card-actions>
                                                <v-btn flat primary @click.native="save()">Сохранить</v-btn>
                                            </v-card-actions>
                                        </template>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs12 md3 lg2 offset-md1 offset-lg1>
                            <v-dialog v-model="startTimeModal" lazy full-width>
                                <v-text-field
                                        slot="activator"
                                        label="Время начала"
                                        prepend-icon="access_time"
                                        locale="ru-RU"
                                        v-model="event.startTime"
                                        :rules="[ function() {return event.startTime != null || 'Выберите время'}]"
                                        readonly>
                                </v-text-field>
                                <v-time-picker v-model="event.startTime" actions format="24hr">
                                    <template scope="{ save }">
                                        <v-card-actions>
                                            <v-btn flat primary @click.native="save()">Сохранить</v-btn>
                                        </v-card-actions>
                                    </template>
                                </v-time-picker>
                            </v-dialog>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md7 lg5 >
                            <div class="text-xs-center">
                                <v-btn block outline class="green--text" @click="createEvent">Создать</v-btn>
                            </div>
                        </v-flex>
                    </v-layout>
                    </v-form>
                </v-container>
            </v-card>
        </div>
    </v-container>
</template>



<script>
    import moment from 'moment';
    import api from '../../api'

    export default {
        name: 'create-event',
        data: () => ({
            event: {
                title: "",
                description: "",
                src: "",
                city: "saratov",
                location: "",
                price: 0,
                startDate: null,
                startTime: null,
            },

            valid: false,
            startDateModal: false,
            startTimeModal: false,
            dataPickerDate: null,
        }),
        methods: {
            dayTodayOrFuture: function (date) {
                let today = new Date().setHours(0); // TODO 29.09.2017: эта шутка работает каждый раз
                return date  >= today
            },

            createEvent: function () {
                if (this.$refs.form.validate()) {
                    if (this.event.src == ''){
                        this.event.src = 'https://i.imgur.com/GgUceLi.png'
                    }
                    /*this.$root.$store.dispatch('createEvents', this.event);*/
                    let csrf = this.$root.$store.state.system.csrf.content;
                    api.events.createEvent(this.event, {headers: {'X-XSRF-TOKEN': csrf }} ).then(
                        response => { // success callback
                            // TODO dispatch('loadEvents') вынести в отдельный API |?|?|?|;
                            let event = JSON.parse(response.bodyText);
                            this.$root.$router.push({ path: '/event/' + event.id})
                        },
                        response => { // error callback
                            console.log("error create event")
                            console.log(response);
                        }
                    );
//                    this.$refs.form.reset();
                    this.event = {
                        title: "",
                        description: "",
                        src: "",
                        city: "saratov",
                        location: "",
                        price: 0,
                        startDate: null,
                        startTime: null,
                    }
                }
            },
            formatWithDots: function (date) {
                if (date !== null) {
                    return moment(date, 'YYYY-MM-DD').format('DD.MM.YY');
                }
            }
        }
    }
</script>



<style>
    .metoo-create-container {
        background-color: #f5f5f5;
        padding-bottom: 40px;
    }
</style>
