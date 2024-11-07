import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useDashboard } from '../use-dashboard'
import type { Student } from '@/types/student.types'

describe('useDashboard', () => {
  const mockStudents: Student[] = [
    {
      ID: 1,
      user_login: 'test_user',
      user_nicename: 'Test User',
      user_email: 'test@example.com',
      user_url: '',
      user_registered: '2024-01-01',
      user_activation_key: '',
      user_status: 0,
      display_name: 'Test User',
      user_role: 'student',
      birthDate: '1990-01-01',
      quizAttempts: [
        {
          attempt_id: 1,
          course_id: 1,
          quiz_id: 1,
          user_id: 1,
          total_questions: 40,
          total_answered_questions: 40,
          total_marks: '100.00',
          earned_marks: '85.00',
          attempt_info: '',
          attempt_status: 'attempt_ended',
          attempt_ip: '',
          attempt_started_at: '',
          attempt_ended_at: '',
          is_manually_reviewed: null,
          manually_reviewed_at: null,
          course_title: '',
          quiz_title: '',
          course_duration: ''
        }
      ],
      enrollment_date: '2024-01-01',
      invoice_number: ''
    }
  ]

  it('should calculate correct dashboard metrics', () => {
    const studentsRef = ref(mockStudents)
    const { totalStudents, completedQuizzes, passedQuizzes } = useDashboard(studentsRef)

    expect(totalStudents.value).toBe(1)
    expect(completedQuizzes.value).toBe(1)
    expect(passedQuizzes.value).toBe(1)
  })

  it('should handle empty students array', () => {
    const studentsRef = ref<Student[]>([])
    const { totalStudents, completedQuizzes, passedQuizzes } = useDashboard(studentsRef)

    expect(totalStudents.value).toBe(0)
    expect(completedQuizzes.value).toBe(0)
    expect(passedQuizzes.value).toBe(0)
  })
})