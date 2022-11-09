<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="home">
    <h1>This is an home page</h1>
    <button @click="LogOut">Se déconnecter</button>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data: function() {
    return {
    }
  },
  methods: {
    LogOut(){
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    }
  }
}
</script>

<style>
</style>