<template>
    <div class="myAppoints">
      <h1>Créneaux</h1>
      <div class="slots-list">
        <SlotItem
        class="slotItem"
        v-for="slot in slots"
        :slot="slot"
        :key="slot.id"  
        @slot-delete="deleteSlot"
        @slot-choice="modifySlot"
      >
      </SlotItem>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import {API_HOST} from '../config';
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
    props: ["SlotModifyOrCreate"], //to use the AddSlot from for modify mod too
    data: function() {
      return {
        /* Initialize slots with an empty array, while waiting for actual data to be retrieved from the API */
        slots: [],
        isInFormMod: false
      }
    },
    created: async function() {
      let response = await axios.get(`${API_HOST}/api/creneaux`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
      let slots = response.data;
      this.slots = slots;
    },
    methods: {
      /*
      updateSlot(newSlot) { //might be usefull latter
        let index = this.slots.findIndex(slot => slot.id === newSlot.id);
        this.slots.splice(index, 1, newSlot);
      },
      */
      deleteSlot(identifient){
        let index = this.slots.findIndex(slot => slot.id === identifient)
        this.slots.splice(index,1)
      },
      modifySlot(slot){
        this.$emit('slot-choice',slot)
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

    .slots-list{
      width: 60%;

      .slotItem{
        margin-bottom: 20px;
      }
    }

  }
  </style>
  