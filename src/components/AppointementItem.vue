<template>
  <div class="appointementitem" :class="{ expanded: isExpanded }"> <!--To show or not the modify and delete button-->
    <div class="appointementitemalwaysdisplay" @click="toggleExpand">
      <div @click="getStudentInfos" v-if="this.$store.state.auth == 'ADMIN'" class="lign">
        <div class="sentence">&#0201lève: </div> <!--élève-->
        <div class="info studentname">{{ studentDescription }}</div> <!--To print the date in a human readable manner-->
      </div>
      <div class="lign">
        <div class="sentence">Le </div>
        <div class="info">{{ this.dateFormat.format(new Date(this.appointement.dateDebut)) }}</div>
        <!--To print the date in a human readable manner-->
      </div>
      <div class="lign">
        <div class="sentence">&#0192 </div>
        <div class="info">{{ this.appointement.dateDebut.slice(11, -3).replace(":", "h") }}</div>
        <!--To print the date in a human readable manner-->
      </div>
      <div class="lign">
        <div class="sentence">Durée: </div>
        <div class="info">{{ appointement.duree.slice(2, 4) }} minutes</div>
        <!--To print the date in a human readable manner-->
      </div>
      <div class="lign">
        <div class="sentence">Moyen de communication: </div>
        <div class="info">{{ appointement.moyenCommunication }}</div> <!--To print the date in a human readable manner-->
      </div>

      <div class="expand-arrow" :class="{expandArrowDown:isExpanded}"> <!--add the arrow to deploy the menu-->
        &#9658 <!--Unicode character for the arrow-->
      </div>
    </div>

    <div class="expendedPart" :class="{collapsed:!isExpanded,extended:isExpanded}"> <!--Expanded menu-->
      <hr />
      <div class="details">
        <div class="cancelButton deleteButton" @click="deleteAppointement">Annuler le rendez-vous</div>
        <div class="moveButton squareButton" @click="modifyApp">Déplacer le rendez-vous</div>
      </div>
    </div>

  </div>
</template>
  
<script>
import axios from 'axios';
import { API_HOST } from '../config';

export default {
  name: 'AppointementItem',
  props: ['appointement'], //to get the appointement from the for in MyAppointments
  data: function () {
    return {
      isExpanded: false,
      dateFormat: new Intl.DateTimeFormat('fr', { //to converte the date to human readable
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      studentDescription: ""
    }
  },
  created: async function () {
    if (this.$store.state.auth == 'ADMIN' && this.appointement.idUser!=-15) { //to avoid error with prefilled info
      let response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/users/admin/submit/${this.appointement.idUser}`, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } });
      let user = response.data;
      this.studentDescription = `${user.lastName} ${user.firstName}`;
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    async deleteAppointement() {
      this.$emit('appointement-delete', this.appointement.id);
    },
    modifyApp() {
      this.$emit('appointement-choice', this.appointement) //to get the appointement id in the MakeAppointements
    },
    getStudentInfos() {
      this.$emit('get-student-info', this.appointement.idUser)
    }
  }
}
</script>
  
<style lang="scss" scoped>
@import "./../scss/globalVariables.scss";

@media (max-width: 500px) {
  .appointementitem{
    background-color: red;
  }
}

.appointementitem {
  font-size: 18px;
  cursor: pointer;
  border: solid $secondColor 5px;
  border-radius: 20px;
  padding: 5px 5px 5px 5px;
  width: 95%;


  .appointementitemalwaysdisplay {
    position: relative;

    .lign {
      display: flex;
      align-items: center;
      margin-bottom: 2.5px;
      margin-top: 2.5px;

      .sentence {
        margin-right: 5px;
      }

      .info {
        font-weight: 600;
        color: $secondColor;
        font-size: 20px;
      }

      .studentname:hover {
        text-decoration: underline;
      }

    }

    .expand-arrow {
      position: absolute;
      top: 3px;
      right: 10px;
      transition: all 0.7s;
    }

    .expandArrowDown{
      transform: rotate(90deg);
    }
  }

  .expendedPart{
    transition: all 0.5s ease-out;
    transition-delay: 0.05s;
    overflow: hidden;

    .details {
      display: flex;
      justify-content: space-around;
    }
  }

  .collapsed{
    max-height: 0;
  }

  .extended{ //use max-height to that it goes to the exact correct size
    max-height: 100px;
  }


}

@media (min-width: 600px) {
  .appointementitem {
    width: 550px;
    padding: 17.5px 20px 17.5px 20px;

    .details {
    

      .cancelButton {
    }

      .moveButton {

    }

  }


  }
}
</style>
  