import { createApp } from 'vue'
import App from './App.vue'
import QueueComponent from './components/QueueComponent.vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

const app = createApp(App)
app.component('QueueComponent', QueueComponent)
app.mount('#app')
