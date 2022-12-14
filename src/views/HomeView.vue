<template>
  <div class="home">
    <div class="SideMenu">
      <MainNavigation ref="mainNavigation" class="MainNavigation" @panel-change="updatePanel"></MainNavigation>
    </div>
    <div class="content">
      <div class="TopMenu">
        <div class="fillInDiv"></div>
        <button @click="ToggleAppoi" v-if="currentPanel.name != 'panelB'">Prendre un rendez-vous</button>
        <button v-if="this.$store.state.auth == 'ADMIN' && currentPanel.name != 'panelB'" @click="ToggleSlot">Ajouter un
          créneau</button>
        <div class="fillInDiv"></div>
      </div>
      <div class="pannels">
        <StudentArea ref="StudentArea" :realSlotsss=this.realSlot class="pannel"
          v-if="currentPanel.name === 'panelA' && this.forceReload"></StudentArea>
        <MyAccount @reset_studentInfos="reset_studentInfos" :studentInfos="studentInfos" classe="pannel"
          v-if="currentPanel.name === 'panelB'"></MyAccount>
        <MyAppointements ref="Myrdvs" @get-student-info="getStudentInfos" @appointement-choice="modifyAppMod"
          :AppModifyOrCreate="AppModifyOrCreate" classe="pannel"
          v-if="currentPanel.name === 'panelC' && this.forceReload"></MyAppointements>
        <!--AppModifyOrCreate is to handle modify mode-->
        <MySlots classe="pannel" @slot-choice="modifySlotMod" v-if="currentPanel.name === 'panelD' && this.forceReload">
        </MySlots>
      </div>
      <div class="MakeAppoi">
        <MakeAppoi @reload="reload" :realSlots=this.realSlot @close-popup="ToggleAppoi"
          :enableModifyMod="enableModifyMod" :AppointementChoice="AppointementChoice" v-if="isAddAppointement">
        </MakeAppoi>
      </div>
      <div class="MakeAppoi">
        <AddSlot @reload="reload" @close-popup="ToggleSlot" :enableModifyModSlot="enableModifyModSlot"
          :SlotChoice="SlotChoice" v-if="isAddSlot"></AddSlot>
      </div>
    </div>

    <div class="notConnect" v-if="this.notConnected">Vous avez été déconnecté. Veuillez vous reconnecter pour poursuivre
      la navigaton</div>
      <p class="legalNotice" @click="legalNotice">Mension légales</p>
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
import VueJwtDecode from 'vue-jwt-decode'; //to decode Jwt token


import axios from 'axios'; //for api request
import { API_HOST, timeBetweenRefreshs } from '../config';

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
  data: function () {
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
      forceReload: true, //to reload the components that have this varaible in their v-if
      studentInfos: null,
      notConnected: false
    }
  },
  created: function () {
    if (this.$store.state.generalToken == null) { //if the page is reloaded the token is delete. This part is to get the tokens back from the url
      let token = this.$route.query.token; //we get the token back from the url
      let refresh_token = this.$route.query.refresh_token; //we get the refresh token back from the url
      this.$store.commit('set', { token: `${token}` }) //set the value of the token to a global state
      this.$store.commit('setAuth', { auth: `${VueJwtDecode.decode(token).roles[0]}` }) //Set the role as a global variable
      this.$store.commit('setRefTok', { refresh_token: `${refresh_token}` }) ////Set the refresh token
      this.$store.commit('setRefreshFunction', { refresh_token_function: setInterval(() => this.refreshToken(), timeBetweenRefreshs) }) //Set the function to periodicaly reset the token
    }


    this.createListRealSlots();
  },
  methods: {
    ToggleAppoi(modifyMod) {
      this.isAddAppointement = this.isAddAppointement != true;
      if (modifyMod != null) { //to automatically cancel modify mode when the popup is close
        this.enableModifyMod = false;
      }
    },
    ToggleSlot(modifyModSlot) {
      this.isAddSlot = this.isAddSlot != true;
      if (modifyModSlot != null) {
        this.enableModifyModSlot = false;
      }
    },
    updatePanel(newPanel) {
      this.currentPanel = newPanel;
    },
    modifyAppMod(app) { //use parametter to be able to reuse the creation box to modify
      this.enableModifyMod = true;
      this.AppointementChoice = app; //to pass the parametter down to MyAppointements
      this.ToggleAppoi();
    },
    modifySlotMod(slot) {//use parametter to be able to reuse the creation box to modify
      this.enableModifyModSlot = true;
      this.SlotChoice = slot; //to pass the parametter down to MySlot
      this.ToggleSlot();
    },
    async reload() { //reload the complonents that have forceReload in there v-if
      // Remove MyComponent from the DOM
      this.createListRealSlots();
      this.forceReload = false;
      // Wait for the change to get flushed to the DOM
      await this.$nextTick();
      // Add the component back in
      this.forceReload = true;
    },
    async createListRealSlots() {
      try {
        //to add slots
        let response = await axios.get(`${API_HOST}/api/creneaux/user`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } }); //get slots from the API
        let slots = response.data; //extract the data
        this.slots = slots; //put it in a new variable
        this.realSlot = []

        for (let j = 0; j < slots.length; j++) { //to create an intance for each real slot
          let daysList = [] //Translate days to numbers
          let day = (this.slots[j].jours);
          for (let i = 0; i < day.length; i++) { //transform days from string to number
            switch (day[i]) {
              case "MONDAY":
                daysList[daysList.length] = 1;
                break;
              case "TUESDAY":
                daysList[daysList.length] = 2;
                break;
              case "WEDNESDAY":
                daysList[daysList.length] = 3;
                break;
              case "THURSDAY":
                daysList[daysList.length] = 4;
                break;
              case "FRIDAY":
                daysList[daysList.length] = 5;
                break;
              case "SATURDAY":
                daysList[daysList.length] = 6;
                break;
              case "SUNDAY":
                daysList[daysList.length] = 0;
                break;
              default:
                console.log("the switch to translate days has a problem");
            }
          }

          let startDate = new Date(this.slots[j].dateDebut)
          let endDate = new Date(this.slots[j].dateFin)
          let listTimeSlot = [] //create a list with start and and time for each timeslot
          this.slots[j].heuresDebutFin.forEach(timeSlot => {
            listTimeSlot.push([timeSlot.tempsDebut, timeSlot.tempsFin])
          });
          while (startDate <= endDate) { //iterate for every days in a slot
            if (daysList.includes(startDate.getUTCDay())) { //check if the day is correct
              listTimeSlot.forEach(timeslot => { //create one event for each time slot
                this.realSlot.push([startDate.toISOString().slice(0, -14) + "T" + timeslot[0].slice(0, -3), startDate.toISOString().slice(0, -14) + "T" + timeslot[1].slice(0, -3)]) //day of the slot + start time + endtime
              });

            }
            startDate.setDate(startDate.getDate() + 1) //add one day to the date
          }

        }
        this.$refs.StudentArea.loadSlots(this.realSlot); //generate all the slots in the calendar
      }
      catch (error) {
        console.log();
        if (error.response.status == 403) {
          console.log("pas connn");
          this.notConnected = true;
        }
      }
    }
    ,
    async refreshToken() { //function to get a new token from the refresh token and update the url
      let response = await axios.get(`${API_HOST}/api/token/refresh`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.refreshToken}` } }); //get slots from the API
      this.$store.commit('set', { token: `${response.data.access_token}` }) //set the value of the token to a global state
      this.$store.commit('setAuth', { auth: `${VueJwtDecode.decode(response.data.access_token).roles[0]}` }) //Set the role as a global variable
      this.$store.commit('setRefTok', { refresh_token: `${response.data.refresh_token}` }) ////Set the refresh token
      this.$router.push({ path: 'home', query: { token: `${response.data.access_token}`, refresh_token: `${response.data.refresh_token}` } }) //change path and add token to url
      console.log("token mis à jour");
    },
    getStudentInfos(id) {
      this.studentInfos = id;
      this.$refs.mainNavigation.changePanel({ id: 1, name: "panelB", tabDisplay: "Mon Compte" }) //force to got to the my account pannel
    },
    reset_studentInfos() {
      this.studentInfos = null;
    },
    legalNotice(){
      this.$router.push("/legalNotice");
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  position: absolute;

  .SideMenu {
    //border: solid red;
    background-color: rgb(149, 187, 224);
    /*$lightBlue;*/
  }

  .content {

    .MakeAppoi {
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, 0);
      z-index: 50;
    }

    .pannels {
      //border: solid palegreen;
    }

    .TopMenu {
      //border: solid blue;

      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      margin-bottom: 10px;

      button {
        background-color: $secondColor;
        color: white;
        font-weight: 600;
        border-radius: 30px;
        font-size: 17px;
        //height: 50px;
        padding: 15px 8px 15px 8px;
        cursor: pointer;

        &:hover {
          background-color: $secondColorLighter
        }
      }

      .fillInDiv {}

    }

    .pannel {
      //height: 570px;
    }
  }

  .notConnect {
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translate(-50%, 50%);
    background-color: white;
    border: 8px solid rgb(215, 61, 61);
    border-radius: 20px;
    font-size: 20px;
    padding: 25px 25px 25px 25px;
    font-weight: bold;
    width: 250px;
    text-align: center;
  }

  .legalNotice{
    margin-top: 70px;
    text-align: center;
    color:#444;
    cursor: pointer;

    &:hover{
      text-decoration:underline;
    }
  }
}
</style>



