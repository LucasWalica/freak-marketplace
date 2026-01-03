import './assets/main.css'
import './index.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router' // Cambiado a WebHistory
import App from './App.vue'

// 1. Importas tus vistas
import HomeView from './components/HomeView.vue';
import LoginView from "./components/auth/LoginView.vue";
import RegisterView from "./components/auth/RegisterView.vue";

// 2. Defines las rutas
const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
]

// 3. Creas el router
const router = createRouter({
  history: createWebHistory(), // Historial de navegador normal
  routes,
})

// 4. CREAS la app, le pasas el ROUTER y luego MONTAS
const app = createApp(App)
app.use(router) 
app.mount('#app')