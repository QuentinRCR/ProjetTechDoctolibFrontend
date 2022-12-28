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

      <div class="expand-arrow"> <!--add the arrow to deploy the menu-->
        {{ isExpanded ? '&#9660;' : '&#9658;' }} <!--Unicode charactere for the arrow-->
      </div>
    </div>
    <template v-if="isExpanded"> <!--Expanded menu-->
      <hr />
      <div class="details">
        <div class="cancelButton" @click="deleteAppointement">Annuler le rendez-vous</div>
        <div class="moveButton" @click="modifyApp">Déplacer le rendez-vous</div>
      </div>
    </template>
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
    if ("this.$store.state.auth == 'ADMIN'") {
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
.appointementitem {
  margin: auto;
  font-size: 18px;
  cursor: pointer;
  border: solid $secondColor;
  border-width: 5px;
  border-radius: 20px;
  padding: 5px 5px 5px 5px;
  width: 90%;


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
    }
  }

  .details {
    display: flex;
    justify-content: space-around;

    .cancelButton {
      font-size: 18px;
      background-color: rgb(215, 61, 61);
      border-radius: 10px;
      padding: 7px 7px 7px 7px;
      color: white;
      font-weight: bold;
      cursor: pointer;

      &:hover{
        background-color: rgba(215, 61, 61, 0.818);
      }
    }

    .moveButton {
      font-size: 18px;
      background-color: $secondColor;
      border-radius: 10px;
      padding: 7px 7px 7px 7px;
      color: white;
      font-weight: bold;
      cursor: pointer;

      &:hover {
        background-color: $secondColorLighter;
      }
    }

  }

}

@media (min-width: 600px) {
  .appointementitem {
    width: 550px;
    padding: 17.5px 20px 17.5px 20px;
  }
}
</style>
  