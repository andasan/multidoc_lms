import { beforeEach, afterEach, vi } from 'vitest'
import { config } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

// Create a proper Vue component mock for Bar
const MockBar = defineComponent({
  name: 'Bar',
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  render() {
    return h('div', { 'data-testid': 'mock-chart' })
  }
})

// Mock Chart.js registration
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  Title: class Title {},
  Tooltip: class Tooltip {},
  Legend: class Legend {},
  BarElement: class BarElement {},
  CategoryScale: class CategoryScale {},
  LinearScale: class LinearScale {}
}))

// Mock vue-chartjs with our proper component
vi.mock('vue-chartjs', () => ({
  Bar: MockBar
}))

// Setup Vue Test Utils global config
config.global.mocks = {
  // Add any global mocks here
}

// Mock environment variables
vi.stubGlobal('import.meta', {
  env: {
    DEV: true,
    VITE_DEV_SERVER_BASE_URL: 'http://localhost:3000',
    VITE_SERVER_BASE_URL: 'http://api.example.com'
  }
})

beforeEach(() => {
  // Setup code
})

afterEach(() => {
  vi.clearAllMocks()
})