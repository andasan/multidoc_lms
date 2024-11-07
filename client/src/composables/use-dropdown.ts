import { ref } from 'vue'

export function useDropdown() {
    const activeDropdownId = ref<number | null>(null)
    const dropdownRefs = ref(new Map())

    const closeDropdown = () => {
        activeDropdownId.value = null
    }

    const toggleDropdown = (id: number, event: Event) => {
        event.stopPropagation()
        activeDropdownId.value = activeDropdownId.value === id ? null : id
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (activeDropdownId.value) {
            const activeDropdownRef = dropdownRefs.value.get(activeDropdownId.value)
            if (activeDropdownRef && !activeDropdownRef.contains(event.target as Node)) {
                closeDropdown()
            }
        }
    }

    return {
        activeDropdownId,
        dropdownRefs,
        closeDropdown,
        toggleDropdown,
        handleClickOutside
    }
}