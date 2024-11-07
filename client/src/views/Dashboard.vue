<script setup lang="ts">
import { onMounted } from 'vue'

import StatsCard from '@/components/general/StatsCard.vue'
import StudentTable from '@/components/student-table/StudentTable.vue'
import { useStudents } from '@/composables/use-students'
import { useDashboard } from '@/composables/use-dashboard'


const { students, isLoading, error, loadStudents } = useStudents()
const { totalStudents, completedQuizzes, passedQuizzes } = useDashboard(students)

onMounted(loadStudents)

</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard title="Total Students" :value="totalStudents" icon="users" :isLoading="isLoading" />
      <StatsCard title="Completed Quizzes" :value="completedQuizzes" icon="check-circle" :isLoading="isLoading" />
      <StatsCard title="Passed Quizzes" :value="passedQuizzes" icon="clock" :isLoading="isLoading" />
    </div>

    <div v-if="!error" class="bg-white shadow-md">
      <StudentTable />
    </div>
  </div>
</template>

<style></style>
