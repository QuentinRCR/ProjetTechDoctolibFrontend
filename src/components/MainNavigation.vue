<template>
  <div class="SlideMenu">
    <div class="nav nav-tabs">
      <div class="nav-item" v-for="panel in panels" :key="panel.id">
        <div 
          class="nav-link" 
          :class="{active: panel.id === currentPanel.id}"
          aria-current="page" href="#"
          @click="changePanel(panel)"
        >{{panel.tabDisplay}}</div>
      </div>
      <div class="LogOutButton" @click="LogOut">Se déconnecter</div>
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
  .SlideMenu{
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: 600;
    font-size: 16px;
    //border: solid pink;
    .nav{
      .active{ //when the element is active
        padding: 5px 7px 5px 7px;
        background-color: rgba(61, 28, 168, 0.162);
        border-radius: 20px;
        font-size:20px;
      }

      display: flex;
      justify-content: space-around;
      flex-flow: row wrap;
      align-items: center;

      .LogOutButton{
        cursor: pointer;
        

        &:hover{
            text-decoration: underline;
          }
      }
      .nav-item{
        //border: solid green;
        cursor: pointer;

        .nav-link{
          color: black;
          padding: 5px 7px 5px 7px;

          &:hover{
            text-decoration: underline;
            border-radius: 10px;
          }
        }
      }
    }
  }
</style>