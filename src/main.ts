import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"


import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router"
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Dealers from './views/Dealers.vue'


import App from './App.vue'
import './style.css'
import { defaultModifiers } from "@popperjs/core/lib/popper-lite"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: "Home", component: Home},
    {path: '/login', name: 'Login', component: Login},
    {path: '/dealers', name: "Dealers", component: Dealers}
  ]
})

export { router };
const app = createApp(App)

app.use(router)
app.mount('#app')
