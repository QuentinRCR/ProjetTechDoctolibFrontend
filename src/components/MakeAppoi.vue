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
        time:null
    }
  },
  created: function(){
    let correctDates=[];
    let realSlots1= new Array(this.realSlots)[0]
    for (let i = 0; i < realSlots1.length; i++) {
      if (!correctDates.includes(realSlots1[i][0].slice(0,-6))) {
        this.allowedDates.push(new Date(realSlots1[i][0].slice(0,-6)))
      }
    }
  },
  components: {
    Datepicker
  },
  methods: {
    async SubmitForm(CommunicationMean,date,time){
      //console.log(time);

      let id;
      if (!this.enableModifyMod){
        id = null;
      }
      else{
        id = this.AppointementChoice.id
      }

      let startTime= ("0"+time.hours).slice(-2)+":"+("0"+time.minutes).slice(-2)+":"+("0"+time.seconds).slice(-2); //Extract start and end time from proxy
      let dateDebut1 = date+"T"+startTime;
      console.log(dateDebut1);
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
