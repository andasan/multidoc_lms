import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCollapseStore = defineStore('collapse', () => {
  const isCollapsed = ref(false);

  function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
  }

  return {
    isCollapsed,
    toggleCollapse,
  };
}, {
  persist: true
});

