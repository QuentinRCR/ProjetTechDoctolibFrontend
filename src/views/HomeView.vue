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
        <MyAppointements ref="Myrdvs" @appointement-choice="ToggleAppoi" :AppModifyOrCreate="AppModifyOrCreate" classe="pannel" v-if="currentPanel.name === 'panelC'"></MyAppointements> <!--AppModifyOrCreate is to handle modify mode-->
        <MySlots classe="pannel" @slot-choice="modifySlotMod" v-if="currentPanel.name === 'panelD'"></MySlots>
      </div>
      <div class="MakeAppoi"><MakeAppoi @close-popup="ToggleAppoi" :enableModifyMod="enableModifyMod" :AppointementChoice="AppointementChoice" v-if="isAddAppointement"></MakeAppoi></div>
      <div class="MakeAppoi"><AddSlot @close-popup="ToggleSlot"  :enableModifyModSlot="enableModifyModSlot" :SlotChoice="SlotChoice" v-if="isAddSlot"></AddSlot></div>
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
      enableModifyMod: false, //is declared here because allow 2 components bellow to communicate - is for appointements
      enableModifyModSlot: false, //is declared here because allow 2 components bellow to communicate
      AppointementChoice: null,
      SlotChoice: null,
      AppModifyOrCreate: null,
    }
  },
  methods: {
    ToggleAppoi(modifyMod){
      this.isAddAppointement = this.isAddAppointement != true;
      if (modifyMod!=null){ //to automatically cancel modify mode when the popup is close
        this.enableModifyMod=false;
      }
    },
    ToggleSlot(modifyModSlot){
      this.isAddSlot = this.isAddSlot !=true;
      if (modifyModSlot!=null){
        this.enableModifyModSlot=false;
      }
    },
    updatePanel(newPanel) {
      this.currentPanel = newPanel;
    },
    LogOut(){
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    },
    modifyAppMod(app){ //use parametter to be able to reuse the creation box to modify
      this.enableModifyMod=true;
      this.AppointementChoice=app; //to pass the parametter down to MyAppointements
      this.ToggleAppoi();
    },
    modifySlotMod(slot){//use parametter to be able to reuse the creation box to modify
      this.enableModifyModSlot=true;
      this.SlotChoice=slot; //to pass the parametter down to MySlot
      this.ToggleSlot();
    }
  }
}
</script>

<style lang="scss" scoped>

.home{

  .SideMenu{
    background-color: rgb(149, 187, 224);
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
      //border: solid palegreen;
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
    //border: solid blue;
    display: flex;
    justify-content: center;

    .fillInDiv{
      width: 60%;
    }

    .TopMenuButtons{
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



