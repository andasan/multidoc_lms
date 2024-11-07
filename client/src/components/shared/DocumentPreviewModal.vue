<script setup lang="ts">
import Button from '@/components/shared/Button.vue';

interface Props {
  isOpen: boolean;
  pdfUrl: string;
  title: string;
  onClose: () => void;
  onDownload?: () => void;
}

defineProps<Props>();
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
      <h2 class="text-2xl font-bold mb-4">{{ title }} Preview</h2>
      <div v-if="title === 'Invoice' && !onDownload" class="flex items-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-md mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">
          To download the PDF, please save and view from the Invoice History tab.
        </span>
      </div>
      <iframe :src="pdfUrl + '#toolbar=0'" class="w-full flex-grow" style="height: 70vh;"></iframe>
      <div class="mt-4 flex justify-end space-x-4">
        <Button 
          v-if="onDownload"
          showIcon="download"
          @click="onDownload"
          buttonClass="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 ease-in-out"
        >
          Download PDF
        </Button>
        <Button 
          showIcon="close"
          @click="onClose"
          buttonClass="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center transition duration-300 ease-in-out"
        >
          Close
        </Button>
      </div>
    </div>
  </div>
</template>