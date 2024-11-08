<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useStudents } from '@/composables/use-students'
import { useStudentTable } from '@/composables/use-student-table'
import StudentTableHeader from './StudentTableHeader.vue'
import StudentTableRow from './StudentTableRow.vue'
import StudentTablePagination from './StudentTablePagination.vue'
import StudentTableFilters from './StudentTableFilters.vue'
import { Student } from '@/types/student.types'

const router = useRouter()
const route = useRoute()

const { students, isLoading, error, loadStudents } = useStudents()

const {
  searchQuery,
  sortColumn,
  sortDirection,
  currentPage,
  itemsPerPage,
  filteredAndSortedStudents,
  paginatedStudents,
  totalPages,
  toggleSort,
  // updateURL,
  nextPage,
  prevPage,
  goToPage,
  openDropdownId,
  toggleDropdown,
  filterStatus,
} = useStudentTable(students, router, route)

const expandedStudentId = ref<string | null>(null)
const highlightedStudentId = ref<string | null>(null)

const toggleExpand = (studentId: string) => {
  if (expandedStudentId.value === studentId) {
    expandedStudentId.value = null
    highlightedStudentId.value = null
  } else {
    expandedStudentId.value = studentId
    highlightedStudentId.value = studentId
  }
}

const navigateToStudentPage = (studentId: string) => {
  router.push(`/students/${studentId}`)
}

onMounted(() => {
  const { page, perPage, sort, order, search } = route.query
  if (page) currentPage.value = parseInt(page as string, 10)
  if (perPage) itemsPerPage.value = parseInt(perPage as string, 10)
  if (sort && typeof sort === 'string') sortColumn.value = sort as keyof Student
  if (order) sortDirection.value = order as 'asc' | 'desc'
  if (search) searchQuery.value = search as string
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between p-4">
      <div class="flex flex-col sm:flex-row gap-4 w-full">
      <input v-model="searchQuery" type="text" placeholder="Search students..."
        class="bg-white max-w-sm border rounded px-2 py-1" />
        <StudentTableFilters
          v-model:filterStatus="filterStatus"
        />
      </div>
      <button @click="loadStudents" class="bg-blue-500 text-white px-4 py-2 rounded">
        Refresh
      </button>
    </div>
    <div v-if="isLoading" class="text-center py-4">Loading...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
    <div v-else class="border-t">
      <div class="w-full overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <StudentTableHeader :sortColumn="sortColumn as keyof Student" :sortDirection="sortDirection"
            @toggle-sort="toggleSort" />
          <tbody class="bg-white divide-y divide-gray-200">
            <StudentTableRow v-for="student in paginatedStudents" 
              :key="student.ID" 
              :student="student"
              :isExpanded="expandedStudentId === student.ID.toString()"
              :isHighlighted="highlightedStudentId === student.ID.toString()" 
              :openDropdownId="openDropdownId"
              @toggle-expand="toggleExpand" @navigate-to-student="navigateToStudentPage"
              @toggle-dropdown="toggleDropdown" />
          </tbody>
        </table>
      </div>
    </div>
    <StudentTablePagination :currentPage="currentPage" :totalPages="totalPages" :itemsPerPage="itemsPerPage"
      :filteredAndSortedStudents="filteredAndSortedStudents" @prev-page="prevPage" @next-page="nextPage"
      @go-to-page="goToPage" />
  </div>
</template>
