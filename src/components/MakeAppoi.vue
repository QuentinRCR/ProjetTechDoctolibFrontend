<template>
<div @click="test" class="makeApp">
    <div class="croix" @click="closePopup">&#10006</div>
    <h1 v-if="!enableModifyMod">Prendre rendez-vous</h1>
    <h1 v-if="enableModifyMod">Modifier rendez-vous</h1>
    
    <!--<v-date-picker v-model="date" :valid-hours="[0,3,4,5,8,16,20]" is24hr />-->
    <form @submit.prevent="submit" v-on:submit="SubmitForm(CommunicationMean,date,time,student)">
        <div class="dateselectorslot">
            <div class="itemdate">
              <p class="">Date:</p>
              <div class="datepicker"><Datepicker :month-change-on-scroll="false" inline v-model="date" :enableTimePicker="false" autoApply modelType="yyyy-MM-dd" :allowedDates="allowedDates"></Datepicker></div>
              <div class="errorMessage" v-show="this.isDateNotSelected">Aucune date n'est selectionnée</div>
            </div>
            <div class="itemtime">
              <p class="">Heure:</p>
              <div class="timepicker"><Datepicker inline :startTime="startTimeee" minutesIncrement="30" minutesGridIncrement="30" hoursGridIncrement="2" v-model="time" timePicker autoApply modeHeight="276" ></Datepicker></div>
              <p class="errorMessage" v-show="!this.isTimeCorrect">L'heure selectionnée n'est pas<br>disponible</p>
              <p class="errorMessage" v-show="this.isAppAlreadyTaken">Il y a déjà un rendez-vous à cette<br>heure</p>
              <p class="errorMessage" v-show="this.isInThePast">Vous ne pouvez pas prendre<br>de rendez-vous dans le passé</p>
            </div>
        </div>
        <div class="CommuMean">
          <p>Moyen de communication</p>
          <select v-model="CommunicationMean" required>
              <!--<option :value="null" disabled>Moyen de communication:</option>-->
              <option v-for="com in CommunicationMeans">{{com.communicationMean}}</option> <!--Get the communication mean from the db-->
          </select><br>
        </div>
        <div v-if="this.$store.state.auth == 'ADMIN'" class="chooseStudent">
          <p>&#0201lève</p> <!--élève-->
          <select v-model="student" required>
            <option v-bind:value="u.id" v-for="u in users">{{u.lastName}} {{u.firstName}}</option>
          </select><br>
        </div>
        <div class="submitpart">
          <input class="boutonsubmit" type="submit" value="Prendre rendez-vous" :style="{
                        color: submitClicked ? '#3694c6' : 'white' //when the button is clicked, we hide the connection button
                    }">
            <div v-if="submitClicked" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    </form>
</div>    


</template>

<script>
import {API_HOST} from "../config"
import axios from 'axios';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { ref } from 'vue'; //used in setup




export default {
  name: 'SignInPage',
  setup: function(){   //to initialise the array with allowed dates 
    let allowedDates = ref([])
    const startTimeee = ref({ hours: 12,minutes: 0}); //start of the time in the time selector

    return {
      allowedDates,
      startTimeee,
    }
    },
  props: ['enableModifyMod',"AppointementChoice","realSlots"],
  data: function() {
    return {
        CommunicationMean: null,
        date: null,
        time:new Proxy({hours: 12,minutes: 0, seconds: 0}, {}), //to initialise the time to 12:00 since it is what is displayed by default
        isTimeCorrect: true,
        student: null,
        users: [],
        isDate: false,
        isDateNotSelected: false,
        submitClicked: false,
        isAppAlreadyTaken: false,
        isInThePast: false,
        CommunicationMeans: []
    }
  },
  created: async function(){

    if(this.$store.state.auth == 'ADMIN'){
      let response = await axios.get(`${API_HOST}/api/users/admin`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
      this.users = response.data;
    }

    let correctDates=[]; //stores the dates that you can select
    let realSlots1= new Array(this.realSlots)[0] //create a copy of the effective times slots day by day to make sur to not accidentally modify something that should not be modified
    for (let i = 0; i < realSlots1.length; i++) {
      if (!correctDates.includes(realSlots1[i][0].slice(0,-6))) { //if the date is not already in the correct dates, we add it (while removing the hours)
        correctDates.push(new Date(realSlots1[i][0].slice(0,-6)))
      }
    }
    this.allowedDates=correctDates;

    //fetch communication means
    let response = await axios.get(`${API_HOST}/api/communicationMean/user`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
    this.CommunicationMeans=response.data;
  },
  components: {
    Datepicker
  },
  methods: {
    async SubmitForm(CommunicationMean,date,time,student){
      if(!this.submitClicked){//to prevent spam
        this.isTimeCorrect=true; //to reset from a previous failed attempte
        this.isAppAlreadyTaken=false;
        this.isInThePast=false;
        this.submitClicked=true;
        if (date==null) { //if no date was selected
          this.isDateNotSelected=true;
        }
        else{
          this.isDateNotSelected=false;
        }


        //if no date is selected, we do not submit the form
        if(!this.isDateNotSelected){
          let id;
          if (!this.enableModifyMod){
            id = null;
          }
          else{
            id = this.AppointementChoice.id //it sets an id only in modify mode
          }

          let startTime= ("0"+time.hours).slice(-2)+":"+("0"+time.minutes).slice(-2)+":"+("0"+time.seconds).slice(-2); //Extract start and end time from proxy
          let dateDebut1 = date+"T"+startTime;
          try{ //try to make a request
            let newAppointemen = await axios.post(`${API_HOST}/api/rendez_vous/user/create_or_modify`,{
              id: id,
              idUser: `${student}`, //automatically assigned by the backend
              idCreneau: 3,
              zoomLink: "link.fr",
              dateDebut: `${dateDebut1}`,
              moyenCommunication: CommunicationMean,
              duree: "PT30M"
              },{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}}
            )
          }
          catch(error){
            if (error.response.data.status == 404){ //when the appointement in not in the slot it returns a 409 error somehow interpreted as a 404
              this.isTimeCorrect=false;
            }
            else if(error.response.data.status == 409){ //if error code is conflict (already an appointement at this time)
              this.isAppAlreadyTaken=true;
            }
            else if(error.response.data.status == 403){ //if error code is conflict (already an appointement at this time)
              this.isInThePast=true;
            }
            else{
              console.log(error);
            }
          }

          if(this.isTimeCorrect && !this.isAppAlreadyTaken && !this.isInThePast){
            this.$emit('close-popup',this.enableModifyMod); //to cancer the modify mode
            this.$emit('reload'); //for the reload of the page to have the correct appointement
          }
        }
        this.submitClicked=false;
      }
    },
    closePopup(){
        this.$emit('close-popup',this.enableModifyMod);
    },
    test(){
    }
  }
}
</script>

<style lang="scss" scoped>

.makeApp{
    background-color: white;
    border: solid $secondColor;
    border-radius: 20px;
    padding: 30px 30px 30px 30px;
    position: relative;
    
    h1{
        margin-top: 0;
        text-align: center;
    }

    .croix{
        position: absolute;
        right: 30px;
        top: 25px;
        cursor: pointer;
        font-size: 18px;
    }


    form{
        display: flex;
        flex-direction: column;
        align-items: center;

        .dateselectorslot{
          margin-bottom: 20px;
          
          p{
            font-weight: bold;
            font-size: 18px;
            margin: 0 0 5px 0;
          }

          .itemdate{
            margin-bottom: 20px;

            .errorMessage{
              color: red;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin-top: 5px;
            }
          }

          .itemtime{
        
            .errorMessage{
              color: red;
              text-align: center;
              font-size: 18px;
            }
          }
        }

        .CommuMean,.chooseStudent{
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          p{
            font-weight: bold;
            font-size: 18px;
            margin: 0 20px 0 0;
          }

          select{
            padding: 10px 10px 10px 10px;
          }
        }

        .submitpart{
          display: flex;
          flex-direction: column;
          position: relative;

          input[type=submit]{
              font-size: 14px;
              //color: #eee;
              font-weight: 600;
              margin-top: 15px;
              background-color: $secondColor;
              border-radius: 84px;
              
              padding: 15px 15px 15px 15px;
              cursor: pointer;
          }

          .lds-ellipsis{
              position: absolute;
              top: 2px;
              left: 50%;
              transform: translate(-50%);
          }
      }

        input[type=text], input[type=password], select{

            font-size: 16px;
            border-radius: 10px;
            border-color: black;

            &:focus{
                outline:solid #72ac51;
            }

            &:focus:invalid{
                outline:solid red;
            }
        }
    }
}

@media (min-width: 600px)
{
  .dateselectorslot{
    display: flex;
    flex-direction: row;
    //border: solid red;

    .itemdate{
      margin-right: 20px;
    }
  }
}

</style>
