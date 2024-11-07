<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, Ref } from 'vue'
import { MoreHorizontal, ChevronUp, ChevronDown } from "lucide-vue-next"

import { Student } from '@/types/student.types'
import { formatDate } from '@/utils/date-utils'

defineProps<{
  student: Student
  isExpanded: boolean
  isHighlighted: boolean
  openDropdownId: string | null
}>()

const emit = defineEmits<{
  (e: 'toggle-expand', studentId: string): void
  (e: 'navigate-to-student', studentId: string): void
  (e: 'toggle-dropdown', studentId: string): void
}>()

const toggleDropdown = (studentId: string, event: Event) => {
  event.stopPropagation()
  emit('toggle-dropdown', studentId) // Emit the event
}

const getQuizStatus = (student: Student) => {
  if (!student.quizAttempts || student.quizAttempts.length === 0) {
    return 'Not Attempted'
  }
  
  return 'Attempted'
}

// Custom directive to detect clicks outside an element
const useClickOutside = (elementRef: Ref<HTMLElement>, callback: () => void) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
}

const dropdownRef = ref<HTMLElement | null>(null)

useClickOutside(dropdownRef as Ref<HTMLElement>, () => {
  emit('toggle-dropdown', '')
})
</script>

<template>
  <tr :class="{ 'bg-blue-100': isHighlighted }">
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ student.ID }}</td>
    <td @click="emit('toggle-expand', student.ID.toString())" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer">
      <div class="flex items-center">
        <span>{{ student.display_name }}</span>
        <component :is="isExpanded ? ChevronUp : ChevronDown" class="ml-2 h-4 w-4" />
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.user_email }}</td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <span :class="{
        'bg-green-600 text-gray-100': getQuizStatus(student) === 'Attempted',
        'bg-gray-100 text-gray-800': getQuizStatus(student) === 'Not Attempted',
        'px-2 py-1 rounded-full text-xs font-medium': true
      }">
        {{ getQuizStatus(student) }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ student.enrollment_date 
            ? formatDate(student.enrollment_date, {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Not enrolled yet' 
      }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="relative inline-block text-left">
        <button @click="(event) => toggleDropdown(student.ID.toString(), event)" type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
          <span class="sr-only">Open options</span>
          <MoreHorizontal class="h-5 w-5" />
        </button>
        <div ref="dropdownRef" v-if="openDropdownId === student.ID.toString()" @click.stop class="origin-top-right absolute right-full mr-2 -mt-6 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          <div class="py-1">
            <a href="#" @click.prevent="emit('navigate-to-student', student.ID.toString())" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Details</a>
          </div>
        </div>
      </div>
    </td>
  </tr>
  <tr v-if="isExpanded">
    <td class="bg-blue-50">  </td>
    <td colspan="5" class="px-6 py-4 bg-blue-50">
      <div class="text-sm text-gray-700">
        <p><strong>Student Details:</strong></p>
        <p>ID: {{ student.ID }}</p>
        <p>Name: {{ student.display_name }}</p>
        <p>Email: {{ student.user_email }}</p>
        <p v-if="student.birthDate">Birthday: {{ student.birthDate }}</p>
        <p v-if="student.enrollment_date">Invoice Issued: {{ student.invoice_number ? 'Yes' : 'No' }}</p>
      </div>
    </td>
  </tr>
</template>
