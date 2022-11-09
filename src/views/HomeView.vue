<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="home">
    <h1>This is an home page</h1>
    <button @click="LogOut">Se déconnecter</button>
    <button @click="ToggleAppoi">Prendre un rendez-vous</button>
    <MakeAppoi @close-popup="ToggleAppoi" v-if="isAddAppointement"></MakeAppoi>
  </div>
</template>

<script>
import MakeAppoi from '../components/MakeAppoi.vue';

export default {
  name: 'HomePage',
  components: {
    MakeAppoi
  },
  data: function() {
    return {
      isAddAppointement: false
    }
  },
  methods: {
    LogOut(){
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    },
    ToggleAppoi(){
      this.isAddAppointement = this.isAddAppointement != true;
    }
  }
}
</script>

<style>
</style>