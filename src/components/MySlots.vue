<template>
    <div class="myAppoints">
      <h1>Créneaux</h1>
      <div class="slots-list">
        <SlotItem 
        v-for="slot in slots"
        :slot="slot"
        :key="slot.id"  
        @slot-delete="deleteSlot"
      >
      </SlotItem>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import {API_HOST, id_Student} from '../config';
  import SlotItem from './SlotItem.vue';
  
  
  
  export default {
    data: function() {
      return {
      }
    },
    components: {
      SlotItem
    },
    name: 'MyAppointments',
    data: function() {
      return {
        /* Initialize slots with an empty array, while waiting for actual data to be retrieved from the API */
        slots: [],
        isInFormMod: false
      }
    },
    created: async function() {
      let response = await axios.get(`${API_HOST}/api/creneaux`);
      let slots = response.data;
      this.slots = slots;
    },
    methods: {
      updateSlot(newSlot) {
        /* Find the place of slot object with the same Id in the array, and replace it */
        let index = this.slots.findIndex(slot => slot.id === newSlot.id);
        this.slots.splice(index, 1, newSlot);
      },
      deleteSlot(identifient){
        let index = this.slots.findIndex(slot => slot.id === identifient)
        this.slots.splice(index,1)
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

    .slots-list{
      width: 60%;
    }

  }
  </style>
  