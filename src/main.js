import { createApp } from 'vue'
import App from './App.vue'
import QueueComponent from './components/QueueComponent.vue'

const app = createApp(App)
app.component('QueueComponent', QueueComponent)
app.mount('#app')
