<template> <!--See AppointementItem to simillar code commented-->
  <div class="slotitem" :class="{ expanded: isExpanded }">
    <div class="slotitemalwaysdisplay" @click="toggleExpand">
      <div class="lign">
        <div class="sentence">Entre le</div>
        <div class="info">{{ this.dateTimeFormat.format(new Date(this.slot.dateDebut)) }}</div>
        <!--To print the date in a human readable manner-->
      </div>
      <div class="lign">
        <div class="sentence">Et le</div>
        <div class="info">{{ this.dateTimeFormat.format(new Date(this.slot.dateFin)) }}</div>
        <!--To print the date in a human readable manner-->
      </div>
      <div class="lign">
        <div class="sentence">Jours: </div>
        <div class="info">{{ this.daysList.slice(0, -2) }}</div> <!--To print the date in a human readable manner-->
      </div>
      <div class="lign"> <!--Write start and end dates-->
        <div class="sentence">Plage de temps: De</div>
        <div class="info spaceright">{{ slot.heuresDebutFin[0].tempsDebut.slice(0, -3).replace(":", "h") }}</div>
        <!--To print the date in a human readable manner-->
        <div class="sentence">à</div>
        <div class="info">{{ slot.heuresDebutFin[0].tempsFin.slice(0, -3).replace(":", "h") }}</div>
      </div>

      <div class="expand-arrow" :class="{expandArrowDown:isExpanded}"> <!--add the arrow to deploy the menu-->
        &#9658 <!--Unicode character for the arrow-->
      </div>
    </div>
    <div class="expendedPart" :class="{collapsed:!isExpanded,extended:isExpanded}"> <!--Expanded menu-->
      <hr />
      <div class="details d-flex">
        <button class="cancelButton deleteButton" @click="deleteSlot">Supprimer le créneau</button>
        <button class="moveButton squareButton" @click="ModifySlot">Modifier le créneau</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import { API_HOST } from '../config';

export default {
  name: 'SlotItem',
  props: ['slot'],
  data: function () {
    return {
      isExpanded: false,
      dateTimeFormat: new Intl.DateTimeFormat('fr', { //to converte the date to human readable
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      daysList: ""
    }
  },
  created: function () {
    for (let i = 0; i < this.slot.jours.length; i++) {
      switch (this.slot.jours[i]) {
        case "MONDAY":
          this.daysList += "Lundi, ";
          break;
        case "TUESDAY":
          this.daysList += "Mardi, ";
          break;
        case "WEDNESDAY":
          this.daysList += "Mercredi, ";
          break;
        case "THURSDAY":
          this.daysList += "Jeudi, ";
          break;
        case "FRIDAY":
          this.daysList += "Vendredi, ";
          break;
        case "SATURDAY":
          this.daysList += "Samedi, ";
          break;
        case "SUNDAY":
          this.daysList += "Dimanche, ";
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
    async deleteSlot() {
      this.$emit('slot-delete', this.slot.id);
    },
    ModifySlot() {
      this.$emit('slot-choice', this.slot)
    }
  }
}
</script>
  
<style lang="scss" scoped>
.slotitem {
  margin: auto;
  font-size: 18px;
  cursor: pointer;
  border: solid $secondColor;
  border-width: 5px;
  border-radius: 20px;
  padding: 5px 5px 5px 5px;
  width: 90%;

  .slotitemalwaysdisplay {
    position: relative;

    .lign {
      display: flex;
      align-items: center;
      margin-bottom: 2.5px;
      margin-top: 2.5px;

      .sentence {
        margin-right: 5px;
      }

      .info {
        font-weight: 600;
        color: $secondColor;
        font-size: 20px;
      }

      .spaceright {
        margin-right: 5px;
      }

    }

    .expand-arrow {
      position: absolute;
      top: 3px;
      right: 10px;
      transition: all 0.7s;
    }

    .expandArrowDown{
      transform: rotate(90deg);
    }
  }

  .expendedPart{
    transition: all 0.5s ease-out;
    transition-delay: 0.05s;
    overflow: hidden;

    .details {
      display: flex;
      justify-content: space-around;
    }
  }

  .collapsed{
    max-height: 0;
  }

  .extended{ //use max-height to that it goes to the exact correct size
    max-height: 100px;
  }

}

@media (min-width: 600px) {
  .slotitem {
    width: 550px;
    padding: 17.5px 20px 17.5px 20px;
  }
}
</style>
  