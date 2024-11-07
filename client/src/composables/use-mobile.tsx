import { ref, onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const isMobile = ref<boolean | undefined>(undefined)

  const onChange = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }

  onMounted(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener('change', onChange)
    onChange() // Set initial value
  })

  onUnmounted(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.removeEventListener('change', onChange)
  })

  return isMobile
}
