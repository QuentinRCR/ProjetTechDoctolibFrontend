<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LogInPage from './components/LogInPage.vue'

</script>

<template>

        <!--RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>-->
  
  <RouterView class="rooter"/>
</template>

<script>
</script>

<style >
.rooter{
  position: absolute;
  top:0;
  left:0;
  right:0;
}
</style>
