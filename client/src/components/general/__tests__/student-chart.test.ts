import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StudentChart from '../StudentChart.vue'
import type { QuizAttempt } from '@/types/quiz.types'

describe('StudentChart', () => {
  const mockQuizAttempts: QuizAttempt[] = [
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
      course_title: 'Course 1',
      quiz_title: 'Quiz 1',
      course_duration: '40'
    },
    {
      attempt_id: 2,
      course_id: 2,
      quiz_id: 2,
      user_id: 1,
      total_questions: 40,
      total_answered_questions: 40,
      total_marks: '100.00',
      earned_marks: '90.00',
      attempt_info: '',
      attempt_status: 'attempt_ended',
      attempt_ip: '',
      attempt_started_at: '',
      attempt_ended_at: '',
      is_manually_reviewed: null,
      manually_reviewed_at: null,
      course_title: 'Course 2',
      quiz_title: 'Quiz 2',
      course_duration: '40'
    }
  ]

  const mountOptions = {
    props: {
      quizAttempts: mockQuizAttempts
    },
    global: {
      stubs: {
        Bar: {
          template: '<div data-testid="mock-chart"></div>',
          props: ['data', 'options']
        }
      }
    }
  }

  it('renders properly with quiz attempts', () => {
    const wrapper = mount(StudentChart, mountOptions)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="mock-chart"]').exists()).toBe(true)
  })

  it('computes chart data correctly', () => {
    const wrapper = mount(StudentChart, mountOptions)
    const chartData = (wrapper.vm as any).chartData
    
    expect(chartData).toEqual({
      labels: ['Quiz 1', 'Quiz 2'],
      datasets: [{
        label: 'Quiz Scores',
        backgroundColor: '#3490dc',
        data: [85, 90]
      }]
    })
  })

  it('applies correct chart options', () => {
    const wrapper = mount(StudentChart, mountOptions)
    const chartOptions = (wrapper.vm as any).chartOptions
    
    expect(chartOptions).toEqual({
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      barPercentage: 0.5,
      categoryPercentage: 0.2
    })
  })

  it('handles empty quiz attempts', () => {
    const wrapper = mount(StudentChart, {
      props: {
        quizAttempts: []
      },
      global: {
        stubs: {
          Bar: {
            template: '<div data-testid="mock-chart"></div>',
            props: ['data', 'options']
          }
        }
      }
    })

    const chartData = (wrapper.vm as any).chartData
    expect(chartData).toEqual({
      labels: [],
      datasets: [{
        label: 'Quiz Scores',
        backgroundColor: '#3490dc',
        data: []
      }]
    })
  })
})
