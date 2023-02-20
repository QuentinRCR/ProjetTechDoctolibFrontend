<template>
  <div class="SlideMenu">
    <div class="nav nav-tabs">
      <div class="nav-item" v-for="panel in panels" :key="panel.id">
        <div
            class="nav-link navbarItem"
            :class="{active: panel.id === currentPanel.id}"
            aria-current="page" href="#"
            @click="changePanel(panel)"
        ><img :src=panel.iconPath> {{ panel.tabDisplay }}
        </div>
      </div>
      <div class="LogOutButton navbarItem" @click="LogOut"><img src="/src/assets/disconnectIcon.png"> Se déconnecter
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'MainNavigation',
  data: function () {
    return {
      currentPanel: null,
      panels: [{
        id: 0,
        name: 'panelA',
        tabDisplay: 'Calendrier',
        iconPath: "/src/assets/calendarIcon.png"
      }, {
        id: 1,
        name: 'panelB',
        tabDisplay: 'Mon Compte',
        iconPath: "/src/assets/MyAccountItem.png"
      },
        {
          id: 2,
          name: 'panelC',
          tabDisplay: 'Mes rendez-vous',
          iconPath: "/src/assets/appointmentIcon.png"
        },
        {
          id: 3,
          name: 'panelD',
          tabDisplay: 'Créneaux',
          iconPath: "/src/assets/timeSlotIcon.png"
        },]
    }
  },
  methods: {
    changePanel(newPanel) {
      this.currentPanel = newPanel;
      this.$emit('panel-change', newPanel);
    },
    LogOut() {
      this.$store.commit('set', {token: null}) //delete the token
      clearInterval(this.$store.state.refreshTokenFunction); //reset the function that refresh the token every x minutes
      console.log("bien déconnecter la personne");
      this.$router.push("/");
    }
  },
  created: function () {
    this.changePanel(this.panels[0]); //define default panel
    if (this.$store.state.auth != "ADMIN") { //hide the slot menu when connected as a client
      this.panels.splice(3, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./../scss/globalVariables.scss";

@media (min-width: 600px) { //to prevent margin used in mobile version to space nav items
  .navbarItem {
    margin-top: 0 !important;
  }
}


.SlideMenu {
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  font-weight: 600;
  font-size: 16px;
  background-color: $lightBlue;
  //border-bottom: solid $secondColor;

  //background: linear-gradient(180deg, $lightBlue 0%, $lightBlue 70%, rgba(149,187,224,0) 100%);

  //border: solid pink;
  .nav {
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
    align-items: center;

    .active { //when the element is active
      //background-color: rgba(61, 28, 168, 0.162);
      //border-radius: 20px;
      transform: scale(1.15);
      opacity: 100%;
    }
  }
}


.navbarItem {
  margin-top: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: black;
  opacity: 70%;
  padding: 5px 7px 5px 7px;
  position: relative;
  transition: 0.1s;

  &:after { //create the effect of underline coming from the side
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

  &:hover {
    color: black;

    &:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }

  img {
    height: 1.3em;
    margin-right: 6px;
  }
}
</style>