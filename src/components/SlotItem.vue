<template> <!--See AppointementItem to simillar code commented-->
    <div @click="test" class="slotitem" :class="{expanded: isExpanded}">
      <div class="slotitemalwaysdisplay" @click="toggleExpand">
        <div class="slot-date">Date début: {{this.dateTimeFormat.format(new Date(this.slot.dateDebut))}}</div>
        <div class="slot-duration">Date fin: {{this.dateTimeFormat.format(new Date(this.slot.dateFin))}}</div>
        <div class="slot-com-channel">Jours: {{this.daysList.slice(0,-2)}}</div>
        <div class="slot-com-channel">Plage de temps: De {{slot.heuresDebutFin[0].tempsDebut.slice(0,-3)}} à {{slot.heuresDebutFin[0].tempsFin.slice(0,-3)}}</div> <!--Ecrit les heures de début et de fin-->
  
        <div class="expand-arrow"> <!--add the arrow to deploy the menu-->
          {{ isExpanded ? '&#9660;' : '&#9658;' }}
        </div>
      </div>
      <template v-if="isExpanded"> <!--Expanded menu-->
        <hr/>
        <div class="details d-flex">
          <button type="button" @click="deleteSlot">Supprimer le créneau</button>
          <button type="button" @click="ModifySlot">Modifier le créneau</button>
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
        isExpanded: false,
        dateTimeFormat : new Intl.DateTimeFormat('fr', { //to converte the date to human readable
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        }),
        daysList: ""
      }
    },
    created: function(){
      for(let i=0;i<this.slot.jours.length;i++){
        switch (this.slot.jours[i]) {
        case "MONDAY":
          this.daysList +="Lundi, ";
          break;
        case "TUESDAY":
          this.daysList +="Mardi, ";
          break;
        case "WEDNESDAY":
          this.daysList +="Mercredi, ";
          break;
        case "THURSDAY":
          this.daysList +="Jeudi, ";
          break;
        case "FRIDAY":
          this.daysList +="Vendredi, ";
          break;  
        case "SATURDAY":
          this.daysList +="Samedi, ";
          break;
        case "SUNDAY":
          this.daysList +="Dimanche, ";
          break;
        default:
            console.log("the switch to translate days has a problem");
        }
      }
    },
    methods: {
      toggleExpand() {
        this.isExpanded = !this.isExpanded;
      },
      async deleteSlot(){
        await axios.delete(`${API_HOST}/api/creneaux/${this.slot.id}`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}});
        this.$emit('slot-delete', this.slot.id);
      },
      ModifySlot(){
        this.$emit('slot-choice',this.slot)
      },
      test(){
        console.log("enlever test dans slot item");
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .slotitem{
    cursor: pointer;
    border: solid gray;
    border-radius: 20px;
    padding: 20px 20px 20px 20px;
    width: 100%;

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
  