import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from 'vuex'
//import VCalendar from "v-calendar"

const store = createStore({
  state () {
    return {
      generalToken: null,
      auth: null
    }
  },
  mutations: {
    set (state,payload) {
      state.generalToken = payload.token;
    },
    setAuth (state,payload) {
      state.auth = payload.auth;
    }
  }
})

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: { VueCal }
}

const app = createApp(App)
app.component(Datepicker,'Datepicker')
app.use(router)
app.use(store)

//app.use(VCalendar, {})
app.mount('#app')