import VueDatepickerUi from 'vue-datepicker-ui'
import 'vue-datepicker-ui/lib/vuedatepickerui.css'

import { createApp } from 'vue'
import '@/assets/datepicker.css'
import App from './App.vue'

import store from './store'
const app = createApp(App)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Datepicker', VueDatepickerUi)

app.use(store)
app.mount('#app')
