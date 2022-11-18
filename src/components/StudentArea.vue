<template>
  <div>
    <VueCal class="VueCal"
    hide-view-selector 
    :time-from="8 * 60"
    :time-to="22 * 60"
    hide-weekends
    :events="events"
    locale="fr"
    ><template v-slot:no-event> <!--remove the no event label when nothing is in the day-->
        <div></div>
    </template>
    </VueCal> <!--hide-view-selector disable the posibility to choose something else than the week view-->
  </div>
</template>

<script>
import VueCal from 'vue-cal' //to display the calendar
import axios from 'axios'; //for api request
import {API_HOST, id_Student} from '../config';

export default {
  name: 'MyAccount',
  data: function() {
    
    return {
      events: []
    }
  },
  components: {
    VueCal
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
              this.realSlot.push([startDate.toISOString().slice(0,-14)+" "+timeslot[0].slice(0,-3),startDate.toISOString().slice(0,-14)+" "+timeslot[1].slice(0,-3)]) //day of the slot + start time + endtime
            });
            
          }
          startDate.setDate(startDate.getDate() +1) //add one day to the date
        }
      }
      
      for(let k=0;k<this.realSlot.length;k++){ //add the instance to the event in the calender
        this.events.push({
        start: `${this.realSlot[k][0]}`,
        end: `${this.realSlot[k][1]}`,
        title: '',
        class: 'slots',
        background: true
        })
      }





      //to add appointements
      let response1 = await axios.get(`${API_HOST}/api/rendez_vous`); //get slots from the API
      let appointements = response1.data; //extract the data
      this.appointements = appointements; //put it in a new variable

      this.appointements.forEach(appointement => {
        let startDateTime= new Date(appointement.dateDebut);
        let endDateTime= new Date(startDateTime.getTime() + (30 -startDateTime.getTimezoneOffset())*60000);
        startDateTime = (appointement.dateDebut.replace('T',' ').slice(0,-3)); //adjuste format
        endDateTime = (endDateTime.toISOString().replace('T',' ').slice(0,-5)); //adjuste format
        this.events.push({
        start: `${startDateTime}`,
        end: `${endDateTime}`,
        title: '',
        class: 'apps'
        })
      });

      
      
      /*for(let k=0;k<this.realApp.length;k++){ //add the instance to the event in the calender
        this.events.push({
        start: `${this.realSlot[k][0]}`,
        end: `${this.realSlot[k][1]}`,
        title: '',
        class: 'apps'
        })
      }*/

    },
  methods: {
    
  }
}
</script>

<style type="scss">

.VueCal{
  /*height: 500px;
  /*width: 1100px;*/
  margin: 0px 20px 20px 20px;
}

.vuecal__event.slots {
  /*background: repeating-linear-gradient(45deg, transparent, transparent 10px, red 10px, #f2f2f2 20px);/* IE 10+ */
  background-color: rgb(149, 187, 224);
  color: rgba(0,0,0,0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -20;
  border-radius: 10px;
}

.vuecal__event.apps{
  background-color: #3694c6;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
}

.vuecal__title-bar{background-color: rgb(149, 187, 224)}

</style>
