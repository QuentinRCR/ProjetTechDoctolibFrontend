<template>
  <div class="SlideMenu">
    <div class="nav nav-tabs">
      <div class="nav-item" v-for="panel in panels" :key="panel.id">
        <div
          class="nav-link navbarItem"
          :class="{active: panel.id === currentPanel.id}"
          aria-current="page" href="#"
          @click="changePanel(panel)"
        >{{panel.tabDisplay}}</div>
      </div>
      <div class="LogOutButton navbarItem" @click="LogOut">Se déconnecter</div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'; //for api request
import {API_HOST} from '../config';
export default {
  name: 'MainNavigation',
  data: function() {
    return {
      currentPanel: null,
      panels: [{
        id: 0,
        name: 'panelA',
        tabDisplay: 'Calendrier'
      }, {
        id: 1,
        name: 'panelB',
        tabDisplay: 'Mon Compte'
      },
      {
        id: 2,
        name: 'panelC',
        tabDisplay: 'Mes rendez-vous'
      },
      {
        id: 3,
        name: 'panelD',
        tabDisplay: 'Créneaux'
      },]
    }
  },
  methods: {
    changePanel(newPanel) {
      this.currentPanel = newPanel;
      this.$emit('panel-change', newPanel);
    },
    LogOut(){
      this.$store.commit('set', {token: null}) //delete the token
      clearInterval(this.$store.state.refreshTokenFunction); //reset the function that refresh the token every x minutes
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    }
  },
  created: function() {
    this.changePanel(this.panels[0]); //define default panel
    if (this.$store.state.auth != "ADMIN"){ //hide the slot menu when connected as a client
      this.panels.splice(3,1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .SlideMenu {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: 600;
    font-size: 16px;
    //border: solid pink;
    .nav {
      display: flex;
      justify-content: space-around;
      flex-flow: row wrap;
      align-items: center;

      .active { //when the element is active
        background-color: rgba(61, 28, 168, 0.162);
        border-radius: 20px;
        transform: scale(1.15);
      }
    }
  }


  .navbarItem{
      cursor: pointer;
      color: black;
      padding: 5px 7px 5px 7px;
      position: relative;
      transition: 0.1s;

      &:after{ //create the effect of underline coming from the side
        content: '';
        position: absolute;
        width: calc(100% - 14px); //to adjust the padding and not have an underline that is too long
        transform: scaleX(0);
        height: 2px;
        bottom: 3px;
        left: 7px;
        background-color: black;
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
      }

      &:hover{
        &:after{
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      }
    }
</style>