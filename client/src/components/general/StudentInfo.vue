<script setup lang="ts">
import { defineProps } from 'vue';

import { GradeCalculator } from "@/utils/grade-calculator"
import { formattedID } from '@/utils/text-utils';

import { Student } from '@/types/student.types';

defineProps<{
    student: Student;
}>();

</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 shadow rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Personal Information</h2>
            <p><strong>Email:</strong> {{ student.user_email }}</p>
            <p><strong>Date of Birth:</strong> {{ student.birthDate || 'N/A' }}</p>
            <p><strong>Student ID:</strong> {{ formattedID(student.ID) }}</p>
        </div>

        <div class="bg-white p-6 shadow rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Academic Summary</h2>
            <p><strong>GPA:</strong> {{ GradeCalculator.calculateAverageGPA(student.quizAttempts) }}</p>
            <p><strong>Earned Credits:</strong> {{ GradeCalculator.calculateEarnedCredits(student.quizAttempts) }}</p>
            <p><strong>Enrollment Status:</strong> {{ student.enrollment_date ? 'Active' : 'Not enrolled' }}</p>
        </div>
    </div>
</template>