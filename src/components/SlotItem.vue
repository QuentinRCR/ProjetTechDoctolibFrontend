<template>
    <div class="slotitem" :class="{expanded: isExpanded}">
      <div class="slotitemalwaysdisplay" @click="toggleExpand">
        <div class="slot-date">Date début: {{slot.dateDebut}}</div>
        <div class="slot-duration">Date fin: {{slot.dateFin}}</div>
        <div class="slot-com-channel">Jours: {{slot.jours}}</div>
        <div class="slot-com-channel">Plage de temps: De {{slot.heuresDebutFin[0].tempsDebut}} à {{slot.heuresDebutFin[0].tempsFin}}</div> <!--Ecrit les heures de début et de fin-->
  
        <div class="expand-arrow"> <!--add the arrow to deploy the menu-->
          {{ isExpanded ? '&#9660;' : '&#9658;' }}
        </div>
      </div>
      <template v-if="isExpanded"> <!--Expanded menu-->
        <hr/>
        <div class="details d-flex">
          <button type="button" @click="deleteSlot">Supprimer le créneau</button>
          <button type="button" @click="deleteWindow">Modifier le créneau</button>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {API_HOST} from '../config';
  
  export default {
    name: 'SlotItem',
    props: ['slot'],
    data: function() {
      return {
        isExpanded: false
      }
    }, 
    computed: {
      isWindowOpen: function() {
        return this.slot.windowStatus === 'OPEN'; 
      }
    },
    methods: {
      toggleExpand() {
        this.isExpanded = !this.isExpanded;
      },
      async deleteSlot(){
        await axios.delete(`${API_HOST}/api/creneaux/${this.slot.id}`);
        this.$emit('slot-delete', this.slot.id);
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .slotitem{
    border: solid gray;
    border-radius: 20px;
    padding: 20px 20px 20px 20px;

    .slotitemalwaysdisplay{
      position: relative;

      .expand-arrow{
      position: absolute;
      top: 3px;
      right: 10px;
    }
    }



  }
  </style>
  