<template>
  <div class="home">
    <div class="SideMenu">
      <MainNavigation @panel-change="updatePanel"></MainNavigation>
    </div>
    <div class="content">
      <div class="TopMenu">
        <div class="TopMenuButtons">
          <button @click="ToggleAppoi">Prendre un rendez-vous</button>
          <button @click="ToggleSlot">Ajouter un créneau</button>
        </div>
        <div class="fillInDiv"></div>
      </div>
      <div class="pannels">
        <StudentArea class="pannel" v-if="currentPanel.name === 'panelA'"></StudentArea>
        <MyAccount classe="pannel" v-if="currentPanel.name === 'panelB'"></MyAccount>
        <MyAppointements ref="Myrdvs" @appointement-choice="modifyAppMod" :AppModifyOrCreate="AppModifyOrCreate" classe="pannel" v-if="currentPanel.name === 'panelC'"></MyAppointements>
        <MySlots classe="pannel" v-if="currentPanel.name === 'panelD'"></MySlots>
      </div>
      <div class="MakeAppoi"><MakeAppoi @close-popup="ToggleAppoi" :enableModifyMod="enableModifyMod" :AppointementChoice="AppointementChoice" v-if="isAddAppointement"></MakeAppoi></div>
      <div class="MakeAppoi"><AddSlot @close-popup="ToggleSlot"  v-if="isAddSlot"></AddSlot></div>
    </div>

    
  </div>
</template>

<script>
import MakeAppoi from '../components/MakeAppoi.vue';
import AddSlot from '../components/AddSlot.vue';
import MainNavigation from '../components/MainNavigation.vue';
import StudentArea from '../components/StudentArea.vue';
import MyAccount from '../components/MyAccount.vue'
import MyAppointements from '../components/MyAppointements.vue'
import MySlots from '../components/MySlots.vue'

export default {
  name: 'HomePage',
  components: {
    MakeAppoi,
    AddSlot,
    MainNavigation,
    StudentArea,
    MyAccount,
    MyAppointements,
    MySlots,
  },
  data: function() {
    return {
      isAddAppointement: false,
      isAddSlot: false,
      currentPanel: {},
      enableModifyMod: false,
      AppointementChoice: null,
      AppModifyOrCreate: null,
    }
  },
  methods: {
    ToggleAppoi(modifyMod,newAppointement){
      this.isAddAppointement = this.isAddAppointement != true;
      if (modifyMod!=null){
        this.enableModifyMod=false;
      }
      if(newAppointement!=null){
        this.AppModifyOrCreate=newAppointement;
      }
    },
    ToggleSlot(){
      this.isAddSlot = this.isAddSlot !=true;
    },
    updatePanel(newPanel) {
      this.currentPanel = newPanel;
    },
    LogOut(){
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    },
    modifyAppMod(app){
      this.enableModifyMod=true;
      this.AppointementChoice=app;
      this.ToggleAppoi();
    }
  }
}
</script>

<style lang="scss" scoped>

.home{

  .SideMenu{
    border: solid red;
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    //height: 100%;
    position:absolute;
    top:0px;
    bottom:0px;
    left:0px;
  }

  .content{

    .MakeAppoi{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -65%);
    }
    
    .pannels{
      border: solid palegreen;
      position: absolute;
      left: 10%;
      top: 100px;
      bottom: 0;
      right: 0;
   }

   .TopMenu{
    position:absolute;
    height: 100px;
    top:0px;
    right:0px;
    left:10%;
    border: solid blue;
    display: flex;
    justify-content: center;

    .fillInDiv{
      width: 60%;
      border: solid red;
    }

    .TopMenuButtons{
      border: solid purple;
      display: flex;
      align-items: center;
      justify-content: space-around;

      button{
        background-color: $secondColor;
        border-radius: 20px;
        //height: 50px;
        padding: 10px 10px 10px 10px;
      }

    }

   }

   .pannel{
    //height: 570px;
   }
  }
   
}

</style>



