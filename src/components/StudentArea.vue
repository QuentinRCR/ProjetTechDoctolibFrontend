<template>
  <div>
    <div v-if="this.$store.state.auth != 'ADMIN'" class="explanation">
      <div>Bienvenue sur cette application de prise de rendez-vous auprès de la psychologue de l'EMSE. Pour prendre un
        rendez-vous, rien de plus simple, il suffit de cliquer sur le bouton "Prendre un rendez-vous".</div>
      <p>
        Les plages disponibles sont représentées sur le calendrier en
        <strong class="lightBlue">bleu clair</strong>
        et les rendez-vous en
        <strong class="darkBlue">bleu foncé.</strong>
      </p>
    </div>
    <VueCal :transitions="false" class="VueCal" hide-view-selector :time-from="8 * 60" :time-to="22 * 60" :events="events" locale="fr"
      events-on-month-view="short"><template v-slot:no-event>
        <!--remove the no event label when nothing is in the day-->
        <div></div>
      </template>
    </VueCal> <!--hide-view-selector disable the posibility to choose something else than the week view-->
  </div>
</template>

<script>
import VueCal from 'vue-cal' //to display the calendar
import axios from 'axios'; //for api request
import { API_HOST } from '../config';

export default {
  name: 'MyAccount',
  props: ['realSlotsss'],
  data: function () {

    return {
      events: [],
      realSlots: null
    }
  },
  components: {
    VueCal
  },
  created: async function () {

    if (this.realSlotsss != null) { //to reload not at login
      this.loadSlots(null);
    }
    //to add appointements

    this.loadApp();


  },
  methods: {

    async loadSlots(realSlot) {
      if (realSlot != null) {
        this.realSlots = realSlot;
      }
      else {
        this.realSlots = this.realSlotsss
      }
      this.realSlot = [];
      this.realSlots.forEach(slot => {
        this.realSlot.push(slot.map(dateee => dateee.replace("T", " "))); //replace the original T by a space
      });

      for (let k = 0; k < this.realSlot.length; k++) { //add the instance to the event in the calender
        this.events.push({
          start: `${this.realSlot[k][0]}`,
          end: `${this.realSlot[k][1]}`,
          title: '',
          class: 'slots',
          background: true
        })
      }
    },
    async loadApp() {
      let response1 = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/rendez_vous/user`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } }); //get slots from the API
      let appointements = response1.data; //extract the data
      this.appointements = appointements; //put it in a new variable

      for (const appointement of this.appointements) { //loop over all the appoitements
        let startDateTime = new Date(appointement.dateDebut);
        let endDateTime = new Date(startDateTime.getTime() + (30 - startDateTime.getTimezoneOffset()) * 60000);
        startDateTime = (appointement.dateDebut.replace('T', ' ').slice(0, -3)); //adjuste format
        endDateTime = (endDateTime.toISOString().replace('T', ' ').slice(0, -5)); //adjuste format

        let infoUser = "";
        let classee="apps";
        if (appointement.idUser != null) { //if the id info is provided it means that it is either an admin or the if of the person watching
          let response;
          try { //try the request if it is an admin
            response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/users/admin/${appointement.idUser}`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } });
          }
          catch (error) {
            if (error.response.data.status == 403) { //if forbiden, it means that a user is trying to do the request so he can get its own infos
              response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/users/user/getbyId`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } });
            }
            else {
              console.log(error);
            }
          }
          this.users = response.data;

          if(window.screen.width>600){ //don't display the name of the personne on phone mode
            infoUser = this.users.lastName + " " + this.users.firstName;
          }
          
          classee="myapps"
        }

        this.events.push({
          start: `${startDateTime}`,
          end: `${endDateTime}`,
          title: `${infoUser}`,
          class: `${classee}`
        })
      };
    }

  }
}
</script>

<style type="scss">

.explanation{
  font-size:18px;
  margin-left:20px;
  margin-right: 20px;
  margin-top:20px;
  margin-bottom: 10px;
}

p{
  margin-top: 5px;
}

.lightBlue{
  color: rgb(149, 187, 224);
  font-weight: bold;
}

.darkBlue{
  color: #3694c6;
  font-weight: bold;
}


.VueCal {
  /*height: 500px;
  /*width: 1100px;*/
  margin: 0px 20px 20px 20px;
}

.vuecal__event.slots {
  /*background: repeating-linear-gradient(45deg, transparent, transparent 10px, red 10px, #f2f2f2 20px);/* IE 10+ */
  background-color: rgb(149, 187, 224);
  color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -20;
  border-radius: 10px;
}

.vuecal__event.apps {
  background-color: #3694c6;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  border: solid 1px black;
}

.vuecal__event.myapps {
  background-color: #364ec6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  border: solid 1px black;
}

.vuecal__title-bar {
  background-color: rgb(149, 187, 224)
}

.vuecal__event-time {
  display: none;
}

/*to remove the time inside the slots*/
</style>
