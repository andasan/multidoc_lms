<script setup lang="ts">
import { FilterStatus } from '@/composables/use-student-table'

defineProps<{
  filterStatus: FilterStatus
}>()

const emit = defineEmits<{
  (e: 'update:filterStatus', value: FilterStatus): void
}>()
</script>

<template>
  <div class="flex gap-2">
    <button
      v-for="(label, status) in {
        all: 'All',
        enrolled: 'Enrolled',
        'not-enrolled': 'Not Enrolled',
        attempted: 'Quiz Attempted',
        'not-attempted': 'Not Attempted'
      }"
      :key="status"
      @click="emit('update:filterStatus', status as FilterStatus)"
      class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
      :class="{
        'bg-blue-500 text-white': filterStatus === status,
        'bg-gray-100 text-gray-700 hover:bg-gray-200': filterStatus !== status
      }"
    >
      {{ label }}
    </button>
  </div>
</template>