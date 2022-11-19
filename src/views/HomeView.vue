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
        <StudentArea class="pannel" v-if="currentPanel.name === 'panelA' && this.forceReload"></StudentArea>
        <MyAccount classe="pannel" v-if="currentPanel.name === 'panelB'"></MyAccount>
        <MyAppointements ref="Myrdvs" @appointement-choice="ToggleAppoi" :AppModifyOrCreate="AppModifyOrCreate" classe="pannel" v-if="currentPanel.name === 'panelC' && this.forceReload"></MyAppointements> <!--AppModifyOrCreate is to handle modify mode-->
        <MySlots classe="pannel" @slot-choice="modifySlotMod" v-if="currentPanel.name === 'panelD' && this.forceReload"></MySlots>
      </div>
      <div class="MakeAppoi"><MakeAppoi @reload="reload" :realSlots=this.realSlot @close-popup="ToggleAppoi" :enableModifyMod="enableModifyMod" :AppointementChoice="AppointementChoice" v-if="isAddAppointement"></MakeAppoi></div>
      <div class="MakeAppoi"><AddSlot @reload="reload" @close-popup="ToggleSlot"  :enableModifyModSlot="enableModifyModSlot" :SlotChoice="SlotChoice" v-if="isAddSlot"></AddSlot></div>
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


import axios from 'axios'; //for api request
import {API_HOST, id_Student} from '../config';

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
      realSlot: null,
      forceReload: true //to reload the components that have this varaible in their v-if
    }
  },
  created: async function() {
    //to add slots
    let response = await axios.get(`${API_HOST}/api/creneaux`); //get slots from the API
    let slots = response.data; //extract the data
    this.slots = slots; //put it in a new variable
    this.realSlot=[]

    for(let j=0;j<slots.length;j++){ //to create an intance for each real slot
      let daysList=[] //Translate days to numbers
      let day=(this.slots[j].jours);
      for(let i=0;i<day.length;i++){ //transform days from string to number
        switch (day[i]) {
          case "MONDAY":
            daysList[daysList.length]=1;
            break;
          case "TUESDAY":
            daysList[daysList.length]=2;
            break;
          case "WEDNESDAY":
            daysList[daysList.length]=3;
            break;
          case "THURSDAY":
            daysList[daysList.length]=4;
            break;
          case "FRIDAY":
            daysList[daysList.length]=5;
            break;  
          case "SATURDAY":
            daysList[daysList.length]=6;
            break;
          case "SUNDAY":
            daysList[daysList.length]=0;
            break;
          default:
            console.log("the switch to translate days has a problem");
        }
      }

      let startDate= new Date(this.slots[j].dateDebut)
      let endDate= new Date(this.slots[j].dateFin)
      let listTimeSlot=[] //create a list with start and and time for each timeslot
      this.slots[j].heuresDebutFin.forEach(timeSlot => {
        listTimeSlot.push([timeSlot.tempsDebut,timeSlot.tempsFin])
      });
      while (startDate <= endDate){ //iterate for every days in a slot
        if (daysList.includes(startDate.getUTCDay())){ //check if the day is correct
          listTimeSlot.forEach(timeslot => { //create one event for each time slot
            this.realSlot.push([startDate.toISOString().slice(0,-14)+"T"+timeslot[0].slice(0,-3),startDate.toISOString().slice(0,-14)+"T"+timeslot[1].slice(0,-3)]) //day of the slot + start time + endtime
          });
          
        }
        startDate.setDate(startDate.getDate() +1) //add one day to the date
      }
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
    },
    async reload(){ //reload the complonents that have forceReload in there v-if
      // Remove MyComponent from the DOM
      this.forceReload = false;
			// Wait for the change to get flushed to the DOM
      await this.$nextTick();
      // Add the component back in
      this.forceReload = true;
    }
  }
}
</script>

<style lang="scss" scoped>

.home{

  .SideMenu{
    background-color: rgb(149, 187, 224);/*$lightBlue;*/
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
      top: 10%;
      left: 50%;
      transform: translate(-50%,0);
      z-index: 50;
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



