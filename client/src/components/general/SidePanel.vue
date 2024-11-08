<script setup lang="ts">
import { computed, FunctionalComponent } from 'vue'
import { useRouter } from 'vue-router'
import { HomeIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
import { useUser } from 'vue-clerk'

import ClerkLogin from './ClerkLogin.vue'

import { COMPANY_LOGO, COMPANY_DETAILS } from '@/constants/company.constants'
import { useCollapseStore } from '@/stores/collapseStore'

interface NavLink {
  path: string
  label: string
  icon: FunctionalComponent
  disabled: boolean
  role: string
}

const router = useRouter()
const collapseStore = useCollapseStore()
const { user } = useUser()

const navLinks: NavLink[] = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon, disabled: false, role: 'basic_member' },
  { path: '/invite-user', label: 'Invite User', icon: UserPlusIcon, disabled: false, role: 'admin' },
]

// Filter navLinks based on user role
const filteredNavLinks = computed<NavLink[]>(() => {
  const userRole = user.value?.publicMetadata?.role || 'basic_member'
  return navLinks.filter(link => {
    // Show all links to admin, or match specific role
    return userRole === 'admin' || link.role === userRole
  })
})
</script>

<template>
  <div
    class="h-full bg-gray-900 text-gray-100 transition-all duration-300 flex flex-col justify-between"
    :style="{
      width: collapseStore.isCollapsed ? '5rem' : '16rem'
    }"
    style="display: flex;"
  >
    <div class="p-6 border-b border-gray-700 flex justify-between items-center">
      <h2 class="text-2xl font-bold flex items-center">
        <img 
          :src="COMPANY_LOGO" 
          alt="Multidoc LMS Logo" 
          class="w-8 h-8"
          :class="{
            'mr-3': !collapseStore.isCollapsed
          }"
        >
        <span v-if="!collapseStore.isCollapsed">{{ COMPANY_DETAILS.name }}</span>
      </h2>
    </div>

    <nav class="flex-grow">
      <router-link v-for="link in filteredNavLinks" :key="link.path" :to="link.path"
        :class="['flex justify-center items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white', { 'opacity-50 pointer-events-none': link.disabled, 'bg-gray-800': router.currentRoute.value.path === link.path }]"
        @click.prevent="link.disabled && $event.preventDefault()"
      >
        <component 
          :is="link.icon" 
          class="w-5 h-5"
          :class="{
            'mr-3': !collapseStore.isCollapsed
          }"
        />
        <span v-if="!collapseStore.isCollapsed">{{ link.label }}</span>
      </router-link>
    </nav>

    <div class="flex flex-col items-center justify-center py-6">
      <ClerkLogin :isCollapsed="collapseStore.isCollapsed" />
    </div>

    <button @click="collapseStore.toggleCollapse"
      class="text-gray-300 hover:text-white border-t border-gray-700 py-3 flex items-center justify-end" :class="[
        'text-gray-300 hover:text-white border-t border-gray-700 py-3 flex items-center justify-end',
        {
          'justify-center': collapseStore.isCollapsed,
          'justify-end pr-5': !collapseStore.isCollapsed
        }
      ]">
      <component :is="collapseStore.isCollapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon" class="w-5 h-5" />
    </button>
  </div>
</template>

<style scoped>
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
