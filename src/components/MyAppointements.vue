<template>
    <div class="myAppoints">
      <h1>Mes rendez-vous</h1>
      <div class="appointements-list">
        <AppointementItem 
        v-for="appointement in appointements"
        :appointement="appointement"
        :key="appointement.id"  
        @appointement-delete="deleteAppointement"
      >
      </AppointementItem>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import {API_HOST, id_Student} from '../config';
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
    data: function() {
      return {
        /* Initialize appointements with an empty array, while waiting for actual data to be retrieved from the API */
        appointements: [],
        isInFormMod: false
      }
    },
    created: async function() {
      let response = await axios.get(`${API_HOST}/api/rendez_vous/user/${id_Student}`);
      let appointements = response.data;
      this.appointements = appointements;
    },
    methods: {
      updateAppointement(newAppointement) {
        /* Find the place of appointement object with the same Id in the array, and replace it */
        let index = this.appointements.findIndex(appointement => appointement.id === newAppointement.id);
        this.appointements.splice(index, 1, newAppointement);
      },
      deleteAppointement(identifient){
        let index = this.appointements.findIndex(appointement => appointement.id === identifient)
        this.appointements.splice(index,1)
      }
    }
  }
  </script>
  
  
  <style lang="scss" scoped>
  .myAppoints{
    overflow: scroll;
    width: 60%;
    width: 100%;

    h1{
      
    }

    .appointements-list{
      width: 60%;
    }

  }
  </style>
  