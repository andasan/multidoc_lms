import { computed, Ref } from 'vue'

import { Student } from '@/types/student.types'

export function useDashboard(students: Ref<Student[]>) {
    const totalStudents = computed(() => students.value.length)
    const completedQuizzes = computed(() =>
        students.value.reduce((total, student) =>
            total + student.quizAttempts.filter(attempt => attempt.attempt_status === 'attempt_ended').length, 0)
    )
    const passedQuizzes = computed(() =>
        students.value.reduce((total, student) =>
            total + student.quizAttempts.filter(attempt => Number(attempt.earned_marks) >= 50).length, 0)
    )

    return {
        totalStudents,
        completedQuizzes,
        passedQuizzes
    }
}