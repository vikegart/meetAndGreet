<template>
    <v-container fluid>
        <v-icon grey--text left @click="$root.$router.back()">arrow_back</v-icon>
        <br />
        <br />
        <p> Мои встречи </p>
    </v-container>
</template>



<script>
    export default {
        name: 'my-event'
    }
</script>