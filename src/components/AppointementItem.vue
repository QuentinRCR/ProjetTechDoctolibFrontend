<template>
    <div class="appointementitem" :class="{expanded: isExpanded}">
      <div class="appointementitemalwaysdisplay" @click="toggleExpand">
        <div class="appointement-date">Date: {{appointement.dateDebut}}</div>
        <div class="appointement-duration">Durée: {{appointement.duree}}</div>
        <div class="appointement-com-channel">Moyen de communication: {{appointement.moyenCommunication}}</div>
  
        <div class="expand-arrow"> <!--add the arrow to deploy the menu-->
          {{ isExpanded ? '&#9660;' : '&#9658;' }}
        </div>
      </div>
      <template v-if="isExpanded"> <!--Expanded menu-->
        <hr/>
        <div class="details d-flex">
          <button type="button" @click="deleteAppointement">Cancel appointement</button>
          <button type="button" @click="deleteWindow">Modify appointement</button>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {API_HOST} from '../config';
  
  export default {
    name: 'AppointementItem',
    props: ['appointement'],
    data: function() {
      return {
        isExpanded: false
      }
    }, 
    computed: {
      isWindowOpen: function() {
        return this.appointement.windowStatus === 'OPEN'; 
      }
    },
    methods: {
      toggleExpand() {
        this.isExpanded = !this.isExpanded;
      },
      async deleteAppointement(){
        await axios.delete(`${API_HOST}/api/rendez_vous/${this.appointement.id}`);
        this.$emit('appointement-delete', this.appointement.id);
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .appointementitem{
    border: solid gray;
    border-radius: 20px;
    padding: 20px 20px 20px 20px;

    .appointementitemalwaysdisplay{
      position: relative;

      .expand-arrow{
      position: absolute;
      top: 3px;
      right: 10px;
    }
    }



  }
  </style>
  