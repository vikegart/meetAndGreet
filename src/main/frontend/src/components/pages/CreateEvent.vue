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
                                    multi-line>
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
                                    :rules="priceRules"
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
                          <v-dialog

                            v-model="startDateModal"
                            lazy
                            full-width
                            width="290px"
                          >
                            <v-text-field
                              slot="activator"
                              label="Дата начала"
                              v-model="event.startDate"
                              prepend-icon="event"
                              :rules="[ function() {return (event.startDate !=null) || 'Выберите дату'}]"
                              readonly
                            ></v-text-field>
                            <v-date-picker
                              v-model="event.startDate"
                              scrollable
                              actions
                              autosave
                              first-day-of-week="1"
                              locale="ru-RU"
                              :date-format="formatWithDots"
                              :formatted-value.sync="event.startDate"
                              :allowed-dates="dayTodayOrFuture">

                            </v-date-picker>
                          </v-dialog>
                        </v-flex>
                        <v-flex xs12 md3 lg2 offset-md1 offset-lg1>
                            <v-dialog v-model="startTimeModal" lazy full-width width="290px">
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
    import moment from 'moment'

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
            today: "",
            valid: false,
            startDateModal: false,
            startTimeModal: false,
            dataPickerDate: null,
            priceRules: [
              (v) => !!v || 'Введите цену',
              (v) => /^\d+$/.test(v) || 'только цифры'
            ]

        }),
        methods: {
            todayBegin: function (){
              this.today = moment();
              this.today.set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
              this.today = this.today.format('x');
            },

            dayTodayOrFuture: function (date) {
                let formattedDate = moment(date, 'YYYY-MM-DD');

                return formattedDate >= this.today
            },

            createEvent: function () {
                if (this.$refs.form.validate()) {
                    if (this.event.src == ''){
                        this.event.src = 'https://i.imgur.com/GgUceLi.png'
                    }
                    this.formatWithDots(this.event);
                    this.$http.post('/events', this.event, {headers: {'content-Type': 'application/json'}}).then(response => {
                      console.log(response);
                      let event = JSON.parse(response.bodyText);
                      this.$root.$router.push({ path: '/event/' + event.id});
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
                    }, response => {
                      console.log(' err create event begin')
                      console.log(response)
                      console.log(' err create event ending')
                    });
                    
                }
            },
            formatWithDots: function (event) {
              let date = event.startDate;
              event.startDate = moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
              return event
            }
        },
        created () {
          this.todayBegin()
        },
    }
</script>



<style>
    .metoo-create-container {
        background-color: #f5f5f5;
        padding-bottom: 40px;
    }
</style>
