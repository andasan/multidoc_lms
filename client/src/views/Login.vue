<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from 'vue-clerk'
import { useRouter } from 'vue-router'

import ClerkLogin from '@/components/general/ClerkLogin.vue';

const startTime = Math.floor(Math.random() * 100)

const gridSize = ref(window.innerWidth < 640 ? 20 : 50)

const updateGridSize = () => {
  gridSize.value = window.innerWidth < 640 ? 20 : 50
}

const router = useRouter()
const { isSignedIn, userId } = useAuth()

watch([isSignedIn, userId], ([newIsSignedIn, newUserId]) => {
  if (newIsSignedIn || newUserId) {
    router.push('/dashboard')
  }
}, { immediate: true })

onMounted(() => {
  document.querySelector('input')?.focus()
  window.addEventListener('resize', updateGridSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateGridSize)
})
</script>

<template>
  <div class="min-h-screen bg-white text-white grid relative login-container">
    <!-- Large background grid -->
    <div class="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-10">
      <div v-for="i in 4" :key="i" class="h-full border-l border-gray-500"></div>
    </div>
    <div class="absolute inset-0 grid grid-rows-4 pointer-events-none opacity-10">
      <div v-for="i in 4" :key="i" class="w-full border-t border-gray-500"></div>
    </div>

    <!-- Login box with smaller grid -->
    <div class="w-full flex items-center justify-center relative z-10 p-12 overflow-hidden login-box h-full">
      <!-- Smaller grid for login box -->
      <div class="absolute inset-0 hidden md:grid pointer-events-none opacity-10"
           :style="`grid-template-columns: repeat(${gridSize}, minmax(0, 1fr)); grid-template-rows: repeat(${gridSize}, minmax(0, 1fr));`">
        <div v-for="i in gridSize * gridSize" :key="i" class="border-r border-b border-gray-500"></div>
      </div>

      <ClerkLogin />
    </div>
    
    <!-- Footer -->
    <div class="absolute bottom-4 left-4 text-gray-600 text-sm font-mono">
      <span>v1.0 started in {{ startTime }}ms</span>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 25% 50% 25%;
}

.login-box {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

@media (max-width: 639px) {
  .login-container {
    grid-template-columns: 10% 1fr 10%;
    grid-template-rows: 1fr;
  }

  .login-box {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
}
</style>
