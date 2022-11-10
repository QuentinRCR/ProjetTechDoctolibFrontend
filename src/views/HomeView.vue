<template>
  <div class="home">
    <div class="SideMenu">
      <MainNavigation @panel-change="updatePanel"></MainNavigation>
      <button @click="LogOut">Se déconnecter</button>
    </div>
    <div class="content">
      <div class="TopMenu">
        <button @click="ToggleAppoi">Prendre un rendez-vous</button>
      </div>
      <MakeAppoi @close-popup="ToggleAppoi"  v-if="isAddAppointement"></MakeAppoi>
      <div class="pannels">
        <StudentArea class="pannel" v-if="currentPanel.name === 'panelA'"></StudentArea>
        <MyAccount classe="pannel" v-if="currentPanel.name === 'panelB'"></MyAccount>
      </div>
    </div>

    
  </div>
</template>

<script>
import MakeAppoi from '../components/MakeAppoi.vue';
import MainNavigation from '../components/MainNavigation.vue';
import StudentArea from '../components/StudentArea.vue';
import MyAccount from '../components/MyAccount.vue'

export default {
  name: 'HomePage',
  components: {
    MakeAppoi,
    MainNavigation,
    StudentArea,
    MyAccount
  },
  data: function() {
    return {
      isAddAppointement: false,
      currentPanel: {}
    }
  },
  methods: {
    ToggleAppoi(){
      this.isAddAppointement = this.isAddAppointement != true;
    },
    updatePanel(newPanel) {
      this.currentPanel = newPanel;
    },
    LogOut(){
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    },
  }
}
</script>

<style lang="scss" scoped>

.home{
  display: flex;
  border: solid hotpink;

  .SideMenu{
    border: solid red;
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 680px;
  }

  .content{
    width: 90%;
    border: solid cadetblue;
    .pannels{
      border: solid palegreen;
   }

   .TopMenu{
    width: 50px;
   }

   .pannel{
    height: 570px;
   }
  }
   
}

</style>



