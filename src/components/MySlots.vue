<template>
  <div>
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
    <div v-if="showConfirmationBox" class="ConfirmationDelete">
        <div>Voulez vous supprimer ce créneau</div>
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
        isInFormMod: false,
        idAppointementToDelete: null,
        showConfirmationBox: false
      }
    },
    created: async function() {
      let response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/creneaux/user `,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
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
        this.showConfirmationBox=true;
        this.idAppointementToDelete=identifient;
      },
      async deleteAppointementForReal(){
        await axios.delete(`${import.meta.env.VITE_APP_API_HOST}/api/creneaux/admin/${this.idAppointementToDelete}`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
        let index = this.slots.findIndex(appointement => appointement.id === this.idAppointementToDelete) //search for the correct id corresponding to the appointement id in order to delete it
        this.slots.splice(index,1)
        this.toggleConfirmationBox();
      },
      toggleConfirmationBox(){
        this.showConfirmationBox=!this.showConfirmationBox;
      },
      modifySlot(slot){
        this.$emit('slot-choice',slot)
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

    .slots-list{

      .slotItem{
        margin-bottom: 20px;
      }
    }

  }

.ConfirmationDelete{
  position: fixed;
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
  