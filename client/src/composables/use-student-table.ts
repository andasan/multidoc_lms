import { ref, computed, watch, Ref } from 'vue'
import { Router, RouteLocationNormalizedLoaded } from 'vue-router'

import { TableSorter } from '@/utils/table-sorter'
import { Student } from '@/types/student.types'

export function useStudentTable(students: Ref<Student[]>, router: Router, route: RouteLocationNormalizedLoaded) {
  const searchQuery = ref('')
  const sortColumn = ref<keyof Student>('user_registered')
  const sortDirection = ref<'asc' | 'desc'>('desc')
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  const openDropdownId = ref<string | null>(null)
  const tableSorter = new TableSorter<Student>()

  const filteredAndSortedStudents = computed(() => {
    const filtered = students.value.filter(student => 
      student.display_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.user_email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    return tableSorter.sort(filtered, sortColumn.value, sortDirection.value)
  })

  const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredAndSortedStudents.value.slice(start, end)
  })

  const totalPages = computed(() => Math.ceil(filteredAndSortedStudents.value.length / itemsPerPage.value))

  const toggleSort = (column: keyof Student) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
    updateURL()
  }

  const updateURL = () => {
    router.push({
      query: {
        ...route.query,
        page: currentPage.value.toString(),
        perPage: itemsPerPage.value.toString(),
        sort: sortColumn.value,
        order: sortDirection.value,
        search: searchQuery.value || undefined
      }
    })
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      updateURL()
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      updateURL()
    }
  }

  const goToPage = (page: number) => {
    currentPage.value = page
    updateURL()
  }

  const toggleDropdown = (studentId: string) => {
    openDropdownId.value = openDropdownId.value === studentId ? null : studentId
  }

  watch(searchQuery, () => {
    currentPage.value = 1
    updateURL()
  })

  return {
    searchQuery,
    sortColumn,
    sortDirection,
    currentPage,
    itemsPerPage,
    filteredAndSortedStudents,
    paginatedStudents,
    totalPages,
    toggleSort,
    updateURL,
    nextPage,
    prevPage,
    goToPage,
    openDropdownId,
    toggleDropdown
  }
}
