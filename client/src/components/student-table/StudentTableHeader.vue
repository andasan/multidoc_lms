<script setup lang="ts">
import { ArrowUpDown } from "lucide-vue-next"
import { Student } from '@/types/student.types'

defineProps<{
  sortColumn: keyof Student
  sortDirection: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'toggle-sort', column: keyof Student): void
}>()
</script>

<template>
  <thead class="bg-blue-50">
    <tr>
      <th @click="emit('toggle-sort', 'ID')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        <div class="flex items-center">
          <span>ID</span>
          <ArrowUpDown :class="{'text-blue-500': sortColumn === 'ID'}" class="ml-1 h-4 w-4" />
        </div>
      </th>
      <th @click="emit('toggle-sort', 'display_name')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        <div class="flex items-center">
          <span>Name</span>
          <ArrowUpDown :class="{'text-blue-500': sortColumn === 'display_name'}" class="ml-1 h-4 w-4" />
        </div>
      </th>
      <th @click="emit('toggle-sort', 'user_email')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        <div class="flex items-center">
          <span>Email</span>
          <ArrowUpDown :class="{'text-blue-500': sortColumn === 'user_email'}" class="ml-1 h-4 w-4" />
        </div>
      </th>
      <th @click="emit('toggle-sort', 'quizAttempts')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        <div class="flex items-center">
          <span>Quiz Status</span>
          <ArrowUpDown :class="{'text-blue-500': sortColumn === 'quizAttempts'}" class="ml-1 h-4 w-4" />
        </div>
      </th>
      <th @click="emit('toggle-sort', 'user_registered')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
        <div class="flex items-center">
          <span>Enrollment Date</span>
          <ArrowUpDown :class="{'text-blue-500': sortColumn === 'user_registered'}" class="ml-1 h-4 w-4" />
        </div>
      </th>
      <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
</template>