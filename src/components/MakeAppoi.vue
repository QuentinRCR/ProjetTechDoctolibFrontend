<template>
<div class="makeApp">
    <div class="croix" @click="closePopup">&#10006</div>
    <h1 v-if="!enableModifyMod">Prendre rendez-vous</h1>
    <h1 v-if="enableModifyMod">Modifier rendez-vous</h1>
    
    <!--<v-date-picker v-model="date" :valid-hours="[0,3,4,5,8,16,20]" is24hr />-->
    <form @submit.prevent="submit" v-on:submit="SubmitForm(CommunicationMean,date,time)">
        <div class="dateselectorslot">
            <p class="">Date et Heure</p>
            <div class="datepicker"><Datepicker v-model="date" autoApply utc="preserve"></Datepicker></div>
        </div>
        <select v-model="CommunicationMean" >
            <option :value="null" disabled>Moyen de communication</option>
            <option>Skype</option>
            <option>Whatsapp</option>
        </select><br>
        <input class="boutonsubmit" type="submit" value="Prendre rendez-vous">
    </form>
</div>    


</template>

<script>
import {API_HOST,id_Student} from "../config"
import axios from 'axios';
import VueCal from 'vue-cal'
import DatePicker from 'v-cal-input'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'






export default {
  name: 'SignInPage',
  props: ['enableModifyMod',"AppointementChoice"],
  data: function() {
    return {
        CommunicationMean: null,
        date: null,
        time: null
    }
  },
  components: {
    VueCal,
    Datepicker
  },
  methods: {
    async SubmitForm(CommunicationMean,date){
      console.log("faire la prise de rendez-vous");
      console.log(date);
      let id;
      if (!this.enableModifyMod){
        id = null;
      }
      else{
        id = this.AppointementChoice.id
      }
      
      let newAppointemen = await axios.post(`${API_HOST}/api/rendez_vous/create_or_modify`,{
        id: id,
        idUser: id_Student,
        idCreneau: 3,
        zoomLink: "link.fr",
        dateDebut: `${date.slice(0,-5)}`,
        moyenCommunication: CommunicationMean,
        duree: "PT30M"
        }
      )
      
      console.log();
      this.$emit('close-popup',this.enableModifyMod,newAppointemen);
    },
    closePopup(){
        this.$emit('close-popup',this.enableModifyMod);
    }
  }
}
</script>

<style lang="scss" scoped>

.makeApp{
    background-color: white;
    border: solid $secondColor;
    border-radius: 20px;
    width: 300px;
    padding: 20px 20px 20px 20px;
    position: relative;
    
    h1{
        margin-top: 0;
        text-align: center;
    }

    .croix{
        position: absolute;
        right: 10px;
        top: 5px;
        cursor: pointer;
        font-size: 16px;
    }


    form{
        display: flex;
        flex-direction: column ;
        

        

        .dateselectorslot{
            display: flex;
            border:solid $secondColor;
            justify-content: center;
            height: 41px;
            margin-bottom: 20px;
            border-radius: 20px;
            padding: 5px 5px 5px 5px;
            .datepicker{
            display: flex;
            margin-bottom: 20px;
            height: 40px;
            align-items: center;
            margin-left: 5px;
            }

            p{
            font-size: 20px;
            font-weight: 600;
            margin-top: 0;
            height: 40px;
            display: flex;
            align-items: center;
            text-align: center;
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

            height: 45px;
            font-size: 16px;
            border-radius: 10px;
            border-color: black;
            margin-bottom: 10px;
            padding-left: 10px;

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
