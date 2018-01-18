<template>
    <v-container fluid pa-0 class="metoo-event-container">
        <v-flex xs12 md6 lg6>
            <v-layout row wrap pt-3 pb-3 pl-0 pr-0>
                <v-btn icon @click="$root.$router.back();">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
            </v-layout>


            <v-layout row wrap>
              <v-jumbotron color="grey lighten-2">
                <v-container fill-height>
                  <v-layout align-center>
                    <v-flex>
                      <h3 class="display-3">Ура, сюда кто-то зашел!</h3>
                      <span class="subheading">Ты можешь создавать встречи или находить тебе интересные! В этом месте будет собрано всегда самое свежее и крутое :) </span>
                      <v-divider class="my-3"></v-divider>
                      <div class="title mb-3">Если ты нашел багу, да и вообще, хочешь со мной пообщаться, тыкай на кнопку</div>
                      <v-btn large color="primary" class="mx-0" @click="vk">Написать мне</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-jumbotron>

            </v-layout>

        </v-flex>
    </v-container>

</template>



<script>
    import moment from 'moment';

    export default {
        name: 'about',
        data: () => ({

        }),

        methods: {
          vk: function() {
            window.location.replace('http://vk.com/v1k3n');
          }
        },
    }
</script>


<style>
    .metoo-event-container {
        background-color: #f5f5f5;
        height: 100%;
    }


</style>
