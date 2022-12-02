<template> <!--See AppointementItem to simillar code commented-->
    <div @click="test" class="slotitem" :class="{expanded: isExpanded}">
      <div class="slotitemalwaysdisplay" @click="toggleExpand">
        <div class="lign">
          <div class="sentence">Entre le</div>
          <div class="info">{{this.dateTimeFormat.format(new Date(this.slot.dateDebut))}}</div> <!--To print the date in a human readable manner-->
        </div>
        <div class="lign">
          <div class="sentence">Et le</div>
          <div class="info">{{this.dateTimeFormat.format(new Date(this.slot.dateFin))}}</div> <!--To print the date in a human readable manner-->
        </div>
        <div class="lign">
          <div class="sentence">Jours: </div>
          <div class="info">{{this.daysList.slice(0,-2)}}</div> <!--To print the date in a human readable manner-->
        </div>
        <div class="lign"> <!--Ecrit les heures de début et de fin-->
          <div class="sentence">Plage de temps: De</div>
          <div class="info spaceright">{{slot.heuresDebutFin[0].tempsDebut.slice(0,-3).replace(":","h")}}</div> <!--To print the date in a human readable manner-->
          <div class="sentence">à</div>
          <div class="info">{{slot.heuresDebutFin[0].tempsFin.slice(0,-3).replace(":","h")}}</div>
        </div>
  
        <div class="expand-arrow"> <!--add the arrow to deploy the menu-->
          {{ isExpanded ? '&#9660;' : '&#9658;' }}
        </div>
      </div>
      <template v-if="isExpanded"> <!--Expanded menu-->
        <hr/>
        <div class="details d-flex">
          <button class="cancelButton" @click="deleteSlot">Supprimer le créneau</button>
          <button class="moveButton" @click="ModifySlot">Modifier le créneau</button>
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
    margin: auto;
    font-size: 18px;
    cursor: pointer;
    border: solid $secondColor;
    border-width: 5px;
    border-radius: 20px;
    padding: 5px 5px 5px 5px;
    width: 90%;

    .slotitemalwaysdisplay{
      position: relative;

      .lign{
        display: flex;
        align-items: center;
        margin-bottom: 2.5px;
        margin-top: 2.5px;

        .sentence{
          margin-right: 5px;
        }

        .info{
          font-weight: 600;
          color: $secondColor;
          font-size: 20px;
        }

        .spaceright{
          margin-right: 5px;  
        }

      }

      .expand-arrow{
      position: absolute;
      top: 3px;
      right: 10px;
    }
    }

    .details{
    display: flex;
    justify-content: space-around;

    .cancelButton{
      font-size: 18px;
      background-color: rgb(215, 61, 61);
      border-radius: 10px;
      padding: 7px 7px 7px 7px;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    .moveButton{
      font-size: 18px;
      background-color: $secondColor;
      border-radius: 10px;
      padding: 7px 7px 7px 7px;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

  }

  }

  @media (min-width: 600px){
    .slotitem{
      width: 550px;
      padding: 17.5px 20px 17.5px 20px;
    }
  }

  
  </style>
  