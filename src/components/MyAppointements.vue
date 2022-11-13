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
    props: ["AppModifyOrCreate"],
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
      updateAppointement() {
        console.log("udateApp");
        /* Find the place of appointement object with the same Id in the array, and replace it */
        //let index = this.appointements.findIndex(appointement => appointement.id === this.AppModifyOrCreate.id);
        //this.appointements.splice(index, 1, this.AppModifyOrCreate);
      },
      deleteAppointement(identifient){
        let index = this.appointements.findIndex(appointement => appointement.id === identifient)
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
  