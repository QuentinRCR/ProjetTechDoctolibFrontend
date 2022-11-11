<template>
<div class="makeApp">
    <div class="croix" @click="closePopup">&#10006</div>
    <h1>Ajouter un créneau</h1>
    
    <!--<v-date-picker v-model="date" :valid-hours="[0,3,4,5,8,16,20]" is24hr />-->
    <form @submit.prevent="submit" v-on:submit="SubmitForm(day,dateSlot,timeSlot)">
        <div class="dateselectorslot">
            <p class="">Plage de jours</p>
            <div class="datepicker"><Datepicker v-model="dateSlot" required autoApply  utc="preserve" range :enableTimePicker="false"></Datepicker></div>
        </div>
        <div class="dateselectorslot">
            <p class="">Plage de temps (de ... à)</p>
            <div class="datepicker"><Datepicker required autoApply v-model="timeSlot" range timePicker></Datepicker></div>
        </div>
        <div class="dayList">
            <p>Jours concernés</p>
            <select v-model="day" multiple required>
                <option>Lundi</option>
                <option>Mardi</option>
                <option>Mercredi</option>
                <option>Jeudi</option>
                <option>Vendredi</option>
                <option>Samedi</option>
                <option>Dimanche</option>
            </select><br>
        </div>
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
  data: function() {
    return {
        day: [],
        dateSlot: null,
        timeSlot: null
    }
  },
  components: {
    VueCal,
    Datepicker 
  },
  methods: {
    async SubmitForm(day,dateSlot,timeSlot){
      console.log("faire ajout créneau");
      console.log(day);
      console.log(dateSlot);
      console.log(timeSlot);
      /*console.log(date);
      let newAppointemen = await axios.post(`${API_HOST}/api/rendez_vous/create_or_modify`,
      {
        id: null,
        idUser: id_Student,
        idCreneau: 3,
        zoomLink: "link.fr",
        dateDebut: `${date.slice(0,-5)}`,
        moyenCommunication: CommunicationMean,
        duree: "PT30M"
        })
      
      console.log();*/
      this.$emit('close-popup');
    },
    closePopup(){
        this.$emit('close-popup');
    }
  }
}
</script>

<style lang="scss" scoped>

.makeApp{
    background-color: white;
    border: solid $secondColor;
    border-radius: 20px;
    width: 500px;
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
                margin-left: 20px;
            }

            .datepicker{
                display: flex;
                margin-bottom: 20px;
                height: 40px;
                align-items: center;
                margin-left: 20px;
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

        input[type=text], input[type=password]{

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

        .dayList{
            display: flex;
            font-size: 16px;
            border-radius: 10px;
            border-color: black;
            margin-bottom: 10px;
            padding-left: 10px;

            select{
                font-size: 20px;
                height: 205px;
            }

            p{
                font-size: 20px;
                font-weight: 600;
                margin-top: 0;
                height: 40px;
                display: flex;
                align-items: center;
                text-align: center;
                margin-right: 20px;
            }
        }
    }
}

</style>
