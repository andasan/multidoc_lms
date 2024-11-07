import { describe, it, expect } from 'vitest'
import { useStudentDetails } from '../use-student-details'

describe('useStudentDetails', () => {
  it('should correctly determine if student passed quiz', () => {
    const { student, hasPassedQuiz } = useStudentDetails()
    
    student.value = {
      ID: 1,
      quizAttempts: [
        {
          course_id: 1,
          earned_marks: '85.00',
          total_marks: '100.00',
          attempt_status: 'attempt_ended'
        }
      ]
    } as any

    expect(hasPassedQuiz.value(1)).toBe(true)
  })

  it('should handle failed quiz attempts', () => {
    const { student, hasPassedQuiz } = useStudentDetails()
    
    student.value = {
      ID: 1,
      quizAttempts: [
        {
          course_id: 1,
          earned_marks: '45.00',
          total_marks: '100.00',
          attempt_status: 'attempt_ended'
        }
      ]
    } as any

    expect(hasPassedQuiz.value(1)).toBe(false)
  })

  it('should handle non-ended quiz attempts', () => {
    const { student, hasPassedQuiz } = useStudentDetails()
    
    student.value = {
      ID: 1,
      quizAttempts: [
        {
          course_id: 1,
          earned_marks: '85.00',
          total_marks: '100.00',
          attempt_status: 'in_progress'
        }
      ]
    } as any

    expect(hasPassedQuiz.value(1)).toBe(false)
  })
})