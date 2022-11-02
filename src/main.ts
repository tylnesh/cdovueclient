import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";


import { createApp } from 'vue';
import { createRouter, createWebHistory } from "vue-router";

import { Quasar } from 'quasar';
import quasarIconSet from 'quasar/icon-set/bootstrap-icons';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';
// ..required because of selected iconSet:
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass' ;

import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Dealers from './views/Dealers.vue';
import Printers from './views/Printers.vue';
import Models from './views/Models.vue';
import Payments from './views/Payments.vue';
import Statuses from './views/Statuses.vue';



import App from './App.vue';
import './style.css';
import { defaultModifiers } from "@popperjs/core/lib/popper-lite";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: 'Home', component: Home},
    {path: '/login', name: 'Login', component: Login},
    {path: '/dealers', name: 'Dealers', component: Dealers},
    {path: '/printers', name: 'Printers', component: Printers},
    {path: '/models', name: 'Models', component: Models},
    {path: '/payments', name: 'Payment Types', component: Payments},
    {path: '/statuses', name: 'Statuses', component: Statuses},


  ]
});

export { router };
const app = createApp(App);
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  iconSet: quasarIconSet,
});
app.use(router);
app.mount('#app');
