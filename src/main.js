import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import router from './router'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

createApp(App).use(router).mount('#app')
