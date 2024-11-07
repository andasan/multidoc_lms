<script setup lang="ts">
import { UsersIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

type IconName = keyof typeof iconComponents;

defineProps<{
  title: string
  value: number | string
  icon: IconName
  isLoading?: boolean
}>()

const iconComponents = {
  users: UsersIcon,
  'check-circle': CheckCircleIcon,
  clock: ClockIcon,
}
</script>

<template>
  <div class="bg-white p-6 shadow">
    <div class="flex items-center">
      <div class="p-3 rounded-full bg-blue-100 text-blue-600">
        <component :is="iconComponents[icon]" class="w-6 h-6" />
      </div>
      <div class="ml-4">
        <h3 class="text-gray-500 text-sm font-medium">{{ title }}</h3>
        <p v-if="!isLoading" class="text-2xl font-semibold text-gray-900">{{ value }}</p>
        <p v-else class="text-2xl font-semibold text-gray-400">Loading...</p>
      </div>
    </div>
  </div>
</template>
