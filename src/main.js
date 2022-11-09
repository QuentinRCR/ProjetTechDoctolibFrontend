import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import VCalendar from "v-calendar"

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

//app.use(VCalendar, {})
app.mount('#app')
