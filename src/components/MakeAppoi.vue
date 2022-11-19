<template>
<div @click="test" class="makeApp">
    <div class="croix" @click="closePopup">&#10006</div>
    <h1 v-if="!enableModifyMod">Prendre rendez-vous</h1>
    <h1 v-if="enableModifyMod">Modifier rendez-vous</h1>
    
    <!--<v-date-picker v-model="date" :valid-hours="[0,3,4,5,8,16,20]" is24hr />-->
    <form @submit.prevent="submit" v-on:submit="SubmitForm(CommunicationMean,date,time)">
        <div class="dateselectorslot">
            <div class="itemdate">
              <p class="">Date:</p>
              <div class="datepicker"><Datepicker inline v-model="date" :enableTimePicker="false" autoApply modelType="yyyy-MM-dd" :allowedDates="allowedDates"></Datepicker></div>
            </div>
            <div class="itemtime">
              <p class="">Heure:</p>
              <div class="timepicker"><Datepicker inline :startTime="startTimeee" minutesIncrement="30" v-model="time" timePicker autoApply modeHeight="276" ></Datepicker></div>
              <p class="errorMessage" v-show="!this.isTimeCorrect">L'heure selectionné n'est pas<br>disponible</p>
            </div>
        </div>
        <div class="CommuMean">
          <p>Moyen de communication</p>
          <select v-model="CommunicationMean" >
              <!--<option :value="null" disabled>Moyen de communication:</option>-->
              <option>Skype</option>
              <option>Whatsapp</option>
          </select><br>
        </div>
        <input class="boutonsubmit" type="submit" value="Prendre rendez-vous">
    </form>
</div>    


</template>

<script>
import {API_HOST,id_Student} from "../config"
import axios from 'axios';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { ref } from 'vue'; //user in setup




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
        isTimeCorrect: true
    }
  },
  created: function(){
    let correctDates=[]; //stores the dates that you can select
    let realSlots1= new Array(this.realSlots)[0] //create a copy of the effective times slots day by day to make sur to not accidentally modify something that should not be modified
    for (let i = 0; i < realSlots1.length; i++) {
      if (!correctDates.includes(realSlots1[i][0].slice(0,-6))) { //if the date is not allready in the correct dates, we add it (while removing the hours)
        correctDates.push(new Date(realSlots1[i][0].slice(0,-6)))
      }
    }
    this.allowedDates=correctDates;
  },
  components: {
    Datepicker
  },
  methods: {
    async SubmitForm(CommunicationMean,date,time){
      //let timeHour= time.hours;
      //let timeMinute = time.minutes
      let timeApp=("0"+time.hours).slice(-2)+":"+("0"+time.minutes).slice(-2); //get the time of the appointement
      let realSlots2=new Array(this.realSlots)[0] //dup just in case
      realSlots2.forEach(slot => { 
        if(date==slot[0].slice(0,-6)){ //if the date is correct, continue
          if (timeApp>=slot[0].slice(-5) && timeApp<=slot[1].slice(-5)){ //if the time is in the slot, that's ok
            this.isTimeCorrect=true;
          }
          else{
            this.isTimeCorrect=false;
          }
        }
      });


      //if the time of the appointement is not good it does not submit the form
      if(this.isTimeCorrect){

        let id;
        if (!this.enableModifyMod){
          id = null;
        }
        else{
          id = this.AppointementChoice.id
        }

        let startTime= ("0"+time.hours).slice(-2)+":"+("0"+time.minutes).slice(-2)+":"+("0"+time.seconds).slice(-2); //Extract start and end time from proxy
        let dateDebut1 = date+"T"+startTime;
        let newAppointemen = await axios.post(`${API_HOST}/api/rendez_vous/create_or_modify`,{
          id: id,
          idUser: id_Student,
          idCreneau: 3,
          zoomLink: "link.fr",
          dateDebut: `${dateDebut1}`,
          moyenCommunication: CommunicationMean,
          duree: "PT30M"
          }
        )

        this.$emit('close-popup',this.enableModifyMod); //to cancer the modify mode
        this.$emit('reload'); //for the reload of the page to have the correct appointement
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
          display: flex;
          margin-bottom: 20px;
          
          p{
            font-weight: bold;
            font-size: 18px;
            margin: 0 0 5px 0;
          }

          .itemdate{
            margin-right: 20px;
          }

          .itemtime{
            .errorMessage{
              color: red;
              text-align: center;
            }
          }
        }

        .CommuMean{
          display: flex;
          align-items: center;

          p{
            font-weight: bold;
            font-size: 18px;
            margin: 0 20px 0 0;
          }

          select{
            padding: 10px 10px 10px 10px;
          }
        }

        input[type=submit]{
            margin-top: 20px;
            background-color: $secondColor;
            border-radius: 84px;
            height: 42px;
            font-size: 14px;
            color: #eee;
            font-weight: 600;
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

</style>
