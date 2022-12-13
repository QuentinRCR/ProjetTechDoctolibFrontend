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
export default {

  components: {
  },
  data: function () {
    return {
      
    }
  },
  created: function () { //change the fav icon depending on the mode
    const favicon = document.getElementById("favicon");

    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      favicon.href = "faviconDarkMode.png";
    }
    else{
      favicon.href = "favicon.png";
    }
  }
}
</script>

<style >
.rooter{
  position: absolute;
  top:0;
  left:0;
  right:0;
}
</style>
