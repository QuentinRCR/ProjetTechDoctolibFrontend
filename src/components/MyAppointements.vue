<template>
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
      >
      </AppointementItem>
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
        isInFormMod: false
      }
    },
    created: async function() {
      let response = await axios.get(`${API_HOST}/api/rendez_vous/auth`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
      let appointements = response.data;
      this.appointements = appointements;
    },
    methods: {
      deleteAppointement(identifient){
        let index = this.appointements.findIndex(appointement => appointement.id === identifient) //search for the correct id corresponding to the appointement id in order to delete it
        this.appointements.splice(index,1)
      },
      modifyApp(app){
        this.$emit('appointement-choice',app)
      }
    }
  }
  </script>
  
  
  <style lang="scss" scoped>
  .myAppoints{
    overflow: scroll;
    width: 60%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1{
      
    }

    .appointements-list{
      width: 60%;

      .AppItem{
        margin-bottom: 20px;
      }
    }

  }
  </style>
  