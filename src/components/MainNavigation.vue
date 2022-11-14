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
      <p class="DeleteButton" @click="LogOut">Se déconnecter</p>
    </div>
    
  </div>
</template>


<script>
export default {
  name: 'MainNavigation',
  data: function() {
    return {
      currentPanel: null,
      panels: [{
        id: 0,
        name: 'panelA',
        tabDisplay: 'Espace élève'
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
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    }
  },
  created: function() {
    this.changePanel(this.panels[0]);
  }
}
</script>

<style lang="scss" scoped>
  .SlideMenu{
    //border: solid pink;
    position: relative;
    .nav{
      //position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      //border: solid blue;
      width: 100%;
      height: 700px;
      .DeleteButton{
        //color: black;
        font-weight: bold;
        cursor: pointer;
        margin-top: 0;
      }
      .nav-item{
        //border: solid green;
        cursor: pointer;

        .nav-link{
          text-decoration: none;
          color: black;
          font-weight: bold;
        }
      }
    }
  }
</style>