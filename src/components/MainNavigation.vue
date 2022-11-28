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
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: 600;
    font-size: 16px;
    //border: solid pink;
    .nav{
      display: flex;
      justify-content: space-around;
      flex-flow: row wrap;
      align-items: center;

      .LogOutButton{
        cursor: pointer;
        
        margin: 3px 5px 3px 5px;
      }
      .nav-item{
        //border: solid green;
        cursor: pointer;

        .nav-link{
          //text-decoration: none;
          color: black;
          margin: 3px 5px 3px 5px;
          //border: solid pink;
        }
      }
    }
  }
</style>