<template>
  <div>
    <VueCal class="VueCal"
    hide-view-selector 
    :time-from="8 * 60"
    :time-to="22 * 60"
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
import {API_HOST} from '../config';

export default {
  name: 'MyAccount',
  props: ['realSlotsss'],
  data: function() {
    
    return {
      events: [],
      realSlots:null
    }
  },
  components: {
    VueCal
  },
  created: async function() {

    if(this.realSlotsss!=null){ //to reload not at login
    this.loadSlots(null);
    }
  
    console.log(this.realSlotsss);
    //to add appointements

    this.loadApp();
      

    },
  methods: {
    
    async loadSlots(realSlot){
      console.log(realSlot);
      if (realSlot!=null){
        this.realSlots=realSlot;
      }
      else{
        console.log("option b");
        this.realSlots=this.realSlotsss
      }
      this.realSlot=[];
      this.realSlots.forEach(slot => {
        this.realSlot.push(slot.map(dateee => dateee.replace("T"," "))); //replace the original T by a space
      });
      
      for(let k=0;k<this.realSlot.length;k++){ //add the instance to the event in the calender
        this.events.push({
        start: `${this.realSlot[k][0]}`,
        end: `${this.realSlot[k][1]}`,
        title: '',
        class: 'slots',
        background: true
        })
      }
      console.log(this.realSlotsss);
    },
    async loadApp(){
      let response1 = await axios.get(`${API_HOST}/api/rendez_vous`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}}); //get slots from the API
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
    }
    
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
