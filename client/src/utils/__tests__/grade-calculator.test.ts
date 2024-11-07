import { describe, it, expect } from 'vitest'
import { GradeCalculator } from '../grade-calculator'
import type { QuizAttempt } from '@/types/quiz.types'

describe('GradeCalculator', () => {
  const mockQuizAttempt: QuizAttempt = {
    attempt_id: 1,
    course_id: 1,
    quiz_id: 1,
    user_id: 1,
    total_questions: 40,
    total_answered_questions: 38,
    total_marks: "100.00",
    earned_marks: "85.00",
    attempt_info: "",
    attempt_status: "attempt_ended",
    attempt_ip: "192.168.1.100",
    attempt_started_at: "2024-03-15T14:00:00.000Z",
    attempt_ended_at: "2024-03-15T14:55:00.000Z",
    is_manually_reviewed: null,
    manually_reviewed_at: null,
    course_title: "Test Course",
    quiz_title: "Test Quiz",
    course_duration: "40"
  }

  describe('calculateGPA', () => {
    it('should calculate correct GPA for 85% score', () => {
      const gpa = GradeCalculator.calculateGPA(mockQuizAttempt)
      expect(gpa).toBe(3.70)
    })

    it('should return 0 for invalid attempt status', () => {
      const invalidAttempt = { ...mockQuizAttempt, attempt_status: '' }
      const gpa = GradeCalculator.calculateGPA(invalidAttempt)
      expect(gpa).toBe(0)
    })
  })

  describe('calculateLetterGrade', () => {
    it('should return correct letter grade for 85% score', () => {
      const grade = GradeCalculator.calculateLetterGrade(mockQuizAttempt)
      expect(grade).toBe('A')
    })

    it('should return F for score below 40%', () => {
      const lowScoreAttempt = { ...mockQuizAttempt, earned_marks: "35.00" }
      const grade = GradeCalculator.calculateLetterGrade(lowScoreAttempt)
      expect(grade).toBe('F')
    })
  })

  describe('calculateAverageGPA', () => {
    it('should calculate correct average GPA for multiple attempts', () => {
      const attempts = [
        { ...mockQuizAttempt, earned_marks: "85.00" },
        { ...mockQuizAttempt, earned_marks: "90.00" }
      ]
      const averageGPA = GradeCalculator.calculateAverageGPA(attempts)
      expect(averageGPA).toBe(3.85) // (3.70 + 4.00) / 2
    })

    it('should return 0 for empty attempts array', () => {
      const averageGPA = GradeCalculator.calculateAverageGPA([])
      expect(averageGPA).toBe(0)
    })
  })

  describe('calculateCourseCredits', () => {
    it('should return 3 credits for passing grade (≥50%)', () => {
      const credits = GradeCalculator.calculateCourseCredits(mockQuizAttempt)
      expect(credits).toBe(3)
    })

    it('should return 0 credits for failing grade (<50%)', () => {
      const failingAttempt = { ...mockQuizAttempt, earned_marks: "45.00" }
      const credits = GradeCalculator.calculateCourseCredits(failingAttempt)
      expect(credits).toBe(0)
    })
  })

  describe('calculateEarnedCredits', () => {
    it('should calculate total earned credits correctly', () => {
      const attempts = [
        { ...mockQuizAttempt, earned_marks: "85.00" }, // Pass (3 credits)
        { ...mockQuizAttempt, earned_marks: "45.00" }, // Fail (0 credits)
        { ...mockQuizAttempt, earned_marks: "90.00" }  // Pass (3 credits)
      ]
      const earnedCredits = GradeCalculator.calculateEarnedCredits(attempts)
      expect(earnedCredits).toBe(6)
    })
  })
})