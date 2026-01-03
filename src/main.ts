import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './plugins/i18n'
import router from './router'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import nuxtuiPlugin from './plugins/nuxtui'
import { initFirebase } from './config/firebase'
import { useAuthStore } from './stores/authStore'
import './assets/styles/main.css'

// Initialiser Firebase
try {
  initFirebase()
  console.log('Firebase initialisé avec succès')
} catch (error) {
  console.warn('Firebase non initialisé:', error instanceof Error ? error.message : error)
}

// Appliquer le thème dark par défaut (comme sur ui.nuxt.com)
document.documentElement.classList.add('dark')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router).use(i18n).use(ui).use(nuxtuiPlugin)

// Initialiser le store d'authentification après la création de Pinia
const authStore = useAuthStore()
authStore.initAuth()

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, 'Vue instance:', instance, 'Error info:', info)
}

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)
  event.preventDefault()
  return false
})

app.mount('#app')
