<template> <!--This template is used to create and to modify a slot. When enableModifyModSlot is true it it the modify module that is displayed-->
<div class="makeApp">
    <div class="croix" @click="closePopup">&#10006</div>
    <h1 v-if=!enableModifyModSlot>Ajouter un créneau</h1>
    <h1 v-if=enableModifyModSlot>Modifier le créneau</h1>
    
    <!--<v-date-picker v-model="date" :valid-hours="[0,3,4,5,8,16,20]" is24hr />-->
    <form @submit.prevent="submit" v-on:submit="SubmitForm(day,dateSlot,timeSlot)">
        <div class="dateselectorslot">
            <p class="">Plage de jours</p>
            <div class="datepicker"><Datepicker v-model="dateSlot" required autoApply closeOnScroll  utc="preserve" range :enableTimePicker="false"></Datepicker></div>
        </div>
        <div class="dateselectorslot">
            <p class="">Plage de temps (de ... à)</p>
            <div class="datepicker"><Datepicker required autoApply v-model="timeSlot" range minutesIncrement="30" timePicker></Datepicker></div>
        </div>
        <div class="dayList">
            <p>Jours concernés</p>
            <select required v-model="day" multiple >
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
import {API_HOST} from "../config" //to get the API path
import axios from 'axios'; 
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css' //to make datepicker work



export default {
  name: 'SignInPage',
  props: ['enableModifyModSlot',"SlotChoice"], //to be able to display the correct thing depending if it is modifying mode or not
  data: function() {
    return {
        day: [],
        dateSlot: null,
        timeSlot: null
    }
  },
  components: {
    Datepicker 
  },
  methods: {
    async SubmitForm(day,dateSlot,timeSlot){

      let startDate= dateSlot[0].slice(0,-14); //Extract start and end date from proxy
      let endDate= dateSlot[1].slice(0,-14);

      let startTime= ("0"+timeSlot[0].hours).slice(-2)+":"+("0"+timeSlot[0].minutes).slice(-2)+":"+("0"+timeSlot[0].seconds).slice(-2); //Extract start and end time from proxy
      let endTime= ("0"+timeSlot[1].hours).slice(-2)+":"+("0"+timeSlot[1].minutes).slice(-2)+":"+("0"+timeSlot[1].seconds).slice(-2); //Formated to hh:mm:ss
      
      let daysList=[] //Extract days from proxy and translate them
      for(let i=0;i<day.length;i++){
        switch (day[i]) {
            case "Lundi":
                daysList[daysList.length]="MONDAY";
                break;
            case "Mardi":
                daysList[daysList.length]="TUESDAY";
                break;
            case "Mercredi":
                daysList[daysList.length]="WEDNESDAY";
                break;
            case "Jeudi":
                daysList[daysList.length]="THURSDAY";
                break;
            case "Vendredi":
                daysList[daysList.length]="FRIDAY";
                break;  
            case "Samedi":
                daysList[daysList.length]="SATURDAY";
                break;
            case "Dimanche":
                daysList[daysList.length]="SUNDAY";
                break;
            default:
                console.log("the switch to translate days has a problem");
            }
        }
      
        let idSlot; 
        if(this.enableModifyModSlot){ //set idSlot if in modify mode
            idSlot=this.SlotChoice.id
        }
        else{
            idSlot=null;
        }

      let newSlot = await axios.post(`${API_HOST}/api/creneaux/create_or_modify`, //Send the resquest to the api with values defined above
      {
        id: idSlot,
        dateDebut: `${startDate}`,
        dateFin: `${endDate}`,
        jours: daysList,
        heuresDebutFin: [
            {
                idPlage: null,
                idCreneaux: 1000,
                tempsDebut: `${startTime}`,
                tempsFin: `${endTime}`
            }
        ]
        })
      this.$emit('close-popup');
      this.$emit('reload'); //for the reload of the page to have the correct appointement
    },
    closePopup(){ //for the cross
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
