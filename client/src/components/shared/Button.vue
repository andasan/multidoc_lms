<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
    onClick: () => void;
    buttonClass?: string;
    iconPosition?: 'left' | 'right';
    showIcon: 'return' | 'next' | 'download' | 'print' | 'close' | 'none' | 'magnify' | 'save' | 'loading' | 'send';
    disabled?: boolean;
}

defineProps<Props>();

const iconPaths = {
  return: 'M10 19l-7-7m0 0l7-7m-7 7h18',
  next: 'M14 5l7 7m0 0l-7 7m7-7H3',
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  print: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z',
  close: 'M6 18L18 6M6 6l12 12',
  magnify: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  save: 'M17 14v6m-3-3h6M6 10a2 2 0 11-2-2V6a2 2 0 112-2h2a2 2 0 112 2v2a2 2 0 11-2 2z',
  loading: 'M12 4.75V6.25M12 17.75V19.25M18.25 12H19.75M4.25 12H5.75M7.34 7.34L8.4 8.4M16.66 16.66L17.72 17.72M16.66 7.34L17.72 6.28M7.34 16.66L8.4 15.6',
  send: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'
};
</script>
        
<template>
    <button 
        :class="buttonClass" 
        @click="onClick"
        :disabled="disabled"
    >
        <svg v-if="iconPosition !== 'right'" 
             class="w-4 h-4 mr-2" 
             fill="none" 
             stroke="currentColor"
             viewBox="0 0 24 24" 
             xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="showIcon !== 'none' ? iconPaths[showIcon] : ''">
            </path>
        </svg>
        <slot></slot>
        <svg v-if="iconPosition === 'right'" 
             class="w-4 h-4 ml-2" 
             fill="none" 
             stroke="currentColor"
             viewBox="0 0 24 24" 
             xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="showIcon !== 'none' ? iconPaths[showIcon] : ''">
            </path>
        </svg>
    </button>
</template>


<style scoped>
button:has(path[d*="M12 4.75"]) svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>