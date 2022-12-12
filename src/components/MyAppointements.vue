<template>
    <div>
      <div class="myAppoints">
        <h1>Mes rendez-vous</h1>
        <div class="appointements-list">
          <AppointementItem 
          class="AppItem"
          v-for="appointement in appointements" 
          :appointement="appointement"
          :key="appointement.id"  
          @appointement-delete="deleteAppointement"
          @appointement-choice="modifyApp"
          @get-student-info="getStudentInfos"
        >
        </AppointementItem>
        </div>
      </div>
      <div v-if="showConfirmationBox" class="ConfirmationDelete">
        <div>Voulez vous supprimer ce rendez-vous</div>
        <div class="buttons">
          <div @click="deleteAppointementForReal" class="deletebutton">Supprimer</div>
          <div @click="toggleConfirmationBox" class="cancelbutton">Annuler</div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import {API_HOST} from '../config';
  import AppointementItem from './AppointementItem.vue';
  
  
  
  export default {
    data: function() {
      return {
      }
    },
    components: {
      AppointementItem
    },
    name: 'MyAppointments',
    props: ["AppModifyOrCreate"], //to use the MakeApp from for modify mod too
    data: function() {
      return {
        /* Initialize appointements with an empty array, while waiting for actual data to be retrieved from the API */
        appointements: [],
        isInFormMod: false,
        idAppointementToDelete: null,
        showConfirmationBox: false
      }
    },
    created: async function() {
      let response = await axios.get(`${API_HOST}/api/rendez_vous/user/auth`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
      let appointements = response.data;
      this.appointements = appointements;
    },
    methods: {
      deleteAppointement(identifient){
        this.showConfirmationBox=true;
        this.idAppointementToDelete=identifient;
      },
      async deleteAppointementForReal(){
        await axios.delete(`${API_HOST}/api/rendez_vous/user/${this.idAppointementToDelete}`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
        let index = this.appointements.findIndex(appointement => appointement.id === this.idAppointementToDelete) //search for the correct id corresponding to the appointement id in order to delete it
        this.appointements.splice(index,1)
        this.toggleConfirmationBox();
      },
      toggleConfirmationBox(){
        this.showConfirmationBox=!this.showConfirmationBox;
      },
      modifyApp(app){
        this.$emit('appointement-choice',app)
      },
      getStudentInfos(id){
        this.$emit('get-student-info',id)
      }
    }
  }
  </script>
  
  
  <style lang="scss" scoped>
  .myAppoints{
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: stretch;

    h1{
      
    }

    .appointements-list{

      .AppItem{
        margin-bottom: 20px;
      }
    }

  }

  .ConfirmationDelete{
    position: fixed ;
    top: 25%;
    left: 50%;
    transform: translate(-50%,50%);
    background-color: white;
    border: 8px solid rgb(215, 61, 61);
    border-radius: 20px;
    font-size: 20px;
    padding: 25px 25px 25px 25px; 
    font-weight: bold;
    width: 250px;
    text-align: center;

    .buttons{
      margin-top:30px;
      display: flex;
      justify-content: space-around;

      .deletebutton{
        color: white;
        border-radius: 10px;
        background-color: rgb(215, 61, 61);
        padding: 8px 8px 8px 8px; 
        cursor:pointer;
      }

      .cancelbutton{
        color: white;
        border-radius: 10px;
        background-color: $secondColor;
        padding: 8px 8px 8px 8px;
        cursor:pointer; 
      }
    }
  }
  </style>
  