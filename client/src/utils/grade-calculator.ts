import type { QuizAttempt } from '@/types/quiz.types'
import { GradeMapping, gradeMapping } from '@/constants/grading-system'

export class GradeCalculator {
  private static readonly gradeMapping: GradeMapping[] = gradeMapping

  private static calculatePercentage(earned: number, total: number): number {
    return (Number(earned) / Number(total)) * 100
  }

  private static findGradeMapping(percentage: number): GradeMapping {
    return (
      this.gradeMapping.find(grade => percentage >= grade.min) || 
      { min: 0, points: 0, letter: 'F' }
    )
  }

  static calculateAverageEarnedMarks(attempts: QuizAttempt[]): number {
    return attempts.reduce((sum, attempt) => sum + Number(attempt.earned_marks), 0) / attempts.length
  }

  static calculateGPA(attempt: QuizAttempt): number {
    if (!attempt.attempt_status) return 0
    
    const percentage = this.calculatePercentage(
      Number(attempt.earned_marks), 
      Number(attempt.total_marks)
    )
    return Number(this.findGradeMapping(percentage).points.toFixed(2))
  }

  static calculateLetterGrade(attempt: QuizAttempt): string {
    const percentage = this.calculatePercentage(
      Number(attempt.earned_marks), 
      Number(attempt.total_marks)
    )
    return this.findGradeMapping(percentage).letter
  }

  static calculateAverageGPA(attempts: QuizAttempt[]): number {
    if (attempts.length === 0) return 0

    const totalPoints = attempts.reduce((sum, attempt) => 
      sum + this.calculateGPA(attempt), 0
    )
    return Number((totalPoints / attempts.length).toFixed(2))
  }

  static calculateAverageLetterGrade(attempts: QuizAttempt[]): string {
    if (attempts.length === 0) return 'F'

    const totalPercentage = attempts.reduce((sum, attempt) => 
      sum + this.calculatePercentage(Number(attempt.earned_marks), Number(attempt.total_marks)), 0
    )
    const averagePercentage = totalPercentage / attempts.length
    return this.findGradeMapping(averagePercentage).letter
  }

  static calculateCourseCredits(attempt: QuizAttempt): number {
    return Number(attempt.earned_marks) >= 50 ? 3 : 0
  }

  static calculateTotalCredits(attempts: QuizAttempt[]): number {
    return attempts.length * 3
  }

  static calculateEarnedCredits(attempts: QuizAttempt[]): number {
    return attempts.reduce((sum, attempt) => sum + this.calculateCourseCredits(attempt), 0)
  }
}
