import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'

import './style.css'
import 'vue3-toastify/dist/index.css';

import App from './App.vue'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import { clerkPlugin } from 'vue-clerk'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

const app = createApp(App)
app.use(clerkPlugin, {
    publishableKey: PUBLISHABLE_KEY,
    afterSignOutUrl: '/',
    
    signInFallbackRedirectUrl: "/dashboard",
    signUpFallbackRedirectUrl: "/dashboard",
    signInForceRedirectUrl: "/dashboard",
    signUpForceRedirectUrl: "/dashboard",

    signInUrl: "/",
    
})
app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right"
} as ToastContainerOptions)
app.mount('#app')
