<template>
  <div class="wrappingDiv" :class="{adminMode : isAdmin}">
    <div class="myAppoints">
      <h1>Mes rendez-vous</h1>
      <div class="appointements-list">
        <AppointementItem class="AppItem" v-for="appointement in appointements" :appointement="appointement"
          :key="appointement.id" @appointement-delete="deleteAppointement" @appointement-choice="modifyApp"
          @get-student-info="getStudentInfos">
        </AppointementItem>
      </div>
    </div>

    <div v-if="isAdmin" class="exportToExcel">
      <h3>Exporter les rendez-vous sous forme de document excel</h3>
      <form @submit.prevent="submit" v-on:submit="SubmitForm(dateSlot)">
        <div class="dateSelectorSlot">
          <p>Choix de la plage de temps:</p>
          <div class="datepicker">
            <Datepicker :month-change-on-scroll="false" v-model="dateSlot" inline required autoApply closeOnScroll
              utc="preserve" range :enableTimePicker="false"></Datepicker>
          </div>
        </div>

        <div class="submitpart">
          <input class="boutonsubmit roundButton" type="submit" value="Exporter">
        </div>
      </form>
    </div>

    <div v-if="showConfirmationBox" class="ConfirmationDelete">
      <div>Voulez vous supprimer ce rendez-vous ?</div>
      <div class="buttons">
        <div @click="deleteAppointementForReal" class="deletebutton">Supprimer</div>
        <div @click="toggleConfirmationBox" class="cancelbutton">Annuler</div>
      </div>
    </div>
  </div>
</template>
  
  
<script>
import axios from 'axios';
import AppointementItem from './AppointementItem.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css' //to make datepicker work
import FileSaver from 'file-saver';



export default {
  components: {
    AppointementItem,
    Datepicker
  },
  name: 'MyAppointments',
  props: ["AppModifyOrCreate"], //to use the MakeApp from for modify mod too
  data: function () {
    return {
      /* Initialize appointements with an dummy info to avoid blinking at render, while waiting for actual data to be retrieved from the API */
      appointements: [{dateDebut: "2022-12-13T20:30:00",duree: "PT30M",id: -1,idCreneau: 1,idUser: -15,moyenCommunication: "zoom",zoomLink: "link.fr"},{dateDebut: "2022-12-13T20:30:00",duree: "PT30M",id: -1,idCreneau: 1,idUser: -15,moyenCommunication: "zoom",zoomLink: "link.fr"}],
      isInFormMod: false,
      idAppointementToDelete: null,
      showConfirmationBox: false,
      dateSlot: null,
      isAdmin: false
    }
  },
  created: async function () {
    let response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/rendez_vous/user/auth`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } });
    let appointements = response.data;
    this.appointements = appointements;
    if (this.$store.state.auth === 'ADMIN'){
      this.isAdmin=true;
    }
  },
  methods: {
    deleteAppointement(identifient) {
      this.showConfirmationBox = true;
      this.idAppointementToDelete = identifient;
    },
    async deleteAppointementForReal() {
      await axios.delete(`${import.meta.env.VITE_APP_API_HOST}/api/rendez_vous/user/${this.idAppointementToDelete}`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } });
      let index = this.appointements.findIndex(appointement => appointement.id === this.idAppointementToDelete) //search for the correct id corresponding to the appointement id in order to delete it
      this.appointements.splice(index, 1)
      this.toggleConfirmationBox();
    },
    toggleConfirmationBox() {
      this.showConfirmationBox = !this.showConfirmationBox;
    },
    modifyApp(app) {
      this.$emit('appointement-choice', app)
    },
    getStudentInfos(id) {
      this.$emit('get-student-info', id)
    },
    async SubmitForm(dateSlot1) {
      let frenshStartDate = dateSlot1[0].slice(8, 10) + "-" + dateSlot1[0].slice(5, 7) + "-" + dateSlot1[0].slice(0, 4);
      let frenshEndDate = dateSlot1[1].slice(8, 10) + "-" + dateSlot1[1].slice(5, 7) + "-" + dateSlot1[1].slice(0, 4);
      let response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/rendez_vous/admin/downloadFile/${dateSlot1[0].slice(0, 10)}/${dateSlot1[1].slice(0, 10)}`,
        { responseType: 'blob' ,
         headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } });


      FileSaver.saveAs(response.data, `RecapRDVDu${frenshStartDate}Au${frenshEndDate}.xlsx`) //name the file with date names

    }
  }
}
</script>
  
  
<style lang="scss" scoped>
@media (min-width:1100px) {
  .wrappingDiv {
    align-items: flex-start; // to avoid right panel stretching
    grid-template-columns: 1fr auto 1fr;
    column-gap: 30px;
    justify-content: center;

    .myAppoints {
      grid-column: 2;
    }

    .exportToExcel{ //to adapt to the height of the title
      margin-top: 80px;
    }
  }
}

@media (min-width:900px) and (max-width:1100px) {
  .wrappingDiv{
    align-items: flex-start; // to avoid right panel stretching

    .myAppoints{
      align-self: center;
      margin-left: 25px;
      margin-right: 25px;
    }
  }

  .adminMode{ //to have 2 columns only when there is a excel exporter on the side
    grid-template-columns: auto auto;
  }

  .exportToExcel{ //to adapt to the height of the title
    margin-top: 80px;
  }
}



.wrappingDiv {;
  display: grid;

  .myAppoints {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      margin-top: 0;
    }

    .appointements-list {

      .AppItem {
        margin-bottom: 20px;
      }
    }

  }

  .ConfirmationDelete {
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

    .buttons {
      margin-top: 30px;
      display: flex;
      justify-content: space-around;

      .deletebutton {
        color: white;
        border-radius: 10px;
        background-color: rgb(215, 61, 61);
        padding: 8px 8px 8px 8px;
        cursor: pointer;
      }

      .cancelbutton {
        color: white;
        border-radius: 10px;
        background-color: $secondColor;
        padding: 8px 8px 8px 8px;
        cursor: pointer;

      }
    }
  }

  .exportToExcel {
    justify-self: center;
    border: solid $secondColor;
    padding: 5px 5px 5px 5px;
    border-radius: 10px;
    margin-right: 20px;
    width: 265px;
    display:flex ;
    flex-direction: column;
    align-items: center;

    h3 {
      text-align: center;
      margin-top: 0;
    }

    p {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
      margin-bottom: 5px;
      color: $secondColor;
    }

    .submitpart{
      display: flex;
      flex-direction: column;
      align-items: center;

      input[type=submit] {
      margin-top: 20px;
    }
  }
    
  }
}
</style>
  