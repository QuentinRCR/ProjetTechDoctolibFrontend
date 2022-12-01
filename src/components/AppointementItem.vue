<template>
    <div @click="test" class="appointementitem" :class="{expanded: isExpanded}"> <!--To show or not the modify and delete button-->
      <div class="appointementitemalwaysdisplay" @click="toggleExpand">
        <div class="appointement-date">Le {{this.dateFormat.format(new Date(this.appointement.dateDebut))}}</div>
        <div class="appointement-time">&#0192 {{this.appointement.dateDebut.slice(11,-3).replace(":","h")}}</div>
        <div class="appointement-duration">Durée: {{appointement.duree.slice(2,4)}} minutes</div>
        <div class="appointement-com-channel">Moyen de communication: {{appointement.moyenCommunication}}</div>
  
        <div class="expand-arrow"> <!--add the arrow to deploy the menu-->
          {{ isExpanded ? '&#9660;' : '&#9658;' }} <!--Unicode charactere for the arrow-->
        </div>
      </div>
      <template v-if="isExpanded"> <!--Expanded menu-->
        <hr/>
        <div class="details d-flex">
          <button type="button" @click="deleteAppointement">Annuler le rendez-vous</button>
          <button type="button" @click="modifyApp">Déplacer le rendez-vous</button>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {API_HOST} from '../config';
  
  export default {
    name: 'AppointementItem',
    props: ['appointement'], //to get the appointement from the for in MyAppointments
    data: function() {
      return {
        isExpanded: false,
        dateFormat : new Intl.DateTimeFormat('fr', { //to converte the date to human readable
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        })
      }
    },
    methods: {
      toggleExpand() {
        this.isExpanded = !this.isExpanded;
      },
      async deleteAppointement(){
        await axios.delete(`${API_HOST}/api/rendez_vous/${this.appointement.id}`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
        this.$emit('appointement-delete', this.appointement.id);
      },
      modifyApp(){ 
        this.$emit('appointement-choice',this.appointement) //to get the appointement id in the MakeAppointements
      },
      test(){
        console.log("enlever la fonction test dans AppoitnementItem");
        console.log(this.dateFormat.format(new Date(this.appointement.dateDebut)));
        console.log(this.appointement.dateDebut.slice(11,-3).replace(":","h"));
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .appointementitem{
    cursor: pointer;
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
  