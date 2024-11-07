<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import { Student } from '@/types/student.types'

defineProps<{
  currentPage: number
  totalPages: number
  itemsPerPage: number
  filteredAndSortedStudents: Student[]
}>()

const emit = defineEmits<{
  (e: 'prev-page'): void
  (e: 'next-page'): void
  (e: 'go-to-page', page: number): void
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between items-center mt-6 px-4 pb-5">
    <div class="text-sm text-gray-600 mb-4 sm:mb-0">
      Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredAndSortedStudents.length) }} of {{ filteredAndSortedStudents.length }} entries
    </div>
    <div class="flex items-center space-x-1">
      <button @click="emit('prev-page')" :disabled="currentPage === 1" class="pagination-button" :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
        <ChevronLeft class="h-5 w-5" />
      </button>
      <div v-for="page in totalPages" :key="page" class="hidden sm:block">
        <button @click="emit('go-to-page', page)" 
          class="pagination-button"
          :class="{ 'bg-blue-500 text-white': currentPage === page }">
          {{ page }}
        </button>
      </div>
      <button @click="emit('next-page')" :disabled="currentPage === totalPages" class="pagination-button" :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
        <ChevronRight class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination-button {
  @apply px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200;
}
</style>