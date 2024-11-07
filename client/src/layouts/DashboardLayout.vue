<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useAuth } from 'vue-clerk'
import { RouterView, useRoute, useRouter } from 'vue-router'

import SidePanel from '@/components/general/SidePanel.vue'
import { useStudents } from '@/composables/use-students'

const pageTitle = ref('Dashboard')
const route = useRoute()
const router = useRouter()
const { getStudentById } = useStudents()

const { userId, isLoaded } = useAuth()

watchEffect(() => {
  if (isLoaded.value && !userId.value) {
    router.push('/')
  }
})

watch(route, async (newRoute) => {
  if (newRoute.name === 'student-details') {
    const studentId = parseInt(newRoute.params.id as string, 10)
    const student = await getStudentById(studentId)
    pageTitle.value = student ? `${student.display_name} Details` : 'Student Details'
  } else {
    pageTitle.value = typeof newRoute.meta.title === 'string' ? newRoute.meta.title : 'Dashboard'
  }
})
</script>

<template>
  <div v-if="!isLoaded">Loading...</div>
  <div v-else class="flex h-screen bg-gray-100">
    <SidePanel class="w-64 hidden md:block" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 p-4">
        <h1 class="text-2xl font-semibold text-gray-800">{{ pageTitle }}</h1>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div :class="{ 
          'mx-auto px-6 py-8': true,
          'container': !$route.path.includes('invoice-editor')
        }">
          <suspense>
            <template #default>
              <RouterView />
            </template>
            <template #fallback>
              <div class="flex items-center justify-center h-full">
                Loading...
              </div>
            </template>
          </suspense>
        </div>
      </main>
    </div>
  </div>
</template>
