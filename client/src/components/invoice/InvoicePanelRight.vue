<script setup lang="ts">
import { watch } from 'vue';
import PreviewWindow from '@/components/general/PreviewWindow.vue';

const props = defineProps<{
  student: any;
  subtotal: number;
  invoiceItems: any[];
  companyInfo: any[];
  invoiceInfo: any[];
  programTitle: string;
  activeTab: 'editor' | 'history';
  previousInvoices: any[];
  selectedInvoice?: any;
}>();

watch(() => [props.invoiceItems, props.companyInfo, props.programTitle], () => {
  updatePreview();
});


const updatePreview = () => {
  // Logic to update the preview
};
</script>

<template>
  <div id="rightSide" class="bg-white p-6 rounded-lg shadow h-full">
    <div v-if="activeTab === 'editor'">
      <PreviewWindow 
        v-if="student" 
        :student="student" 
        :subtotal="subtotal" 
        :invoice-items="invoiceItems"
        :company-info="companyInfo" 
        :invoice-info="invoiceInfo" 
        :program-title="programTitle" 
      />
    </div>
    <div v-else-if="activeTab === 'history'" class="flex items-center justify-center h-full">
      <div v-if="selectedInvoice">
        <PreviewWindow 
          v-if="student" 
          :student="student" 
          :subtotal="subtotal" 
          :invoice-items="invoiceItems"
          :company-info="companyInfo" 
          :invoice-info="invoiceInfo" 
          :program-title="programTitle" 
        />
      </div>
      <p v-else-if="previousInvoices.length === 0" class="text-gray-500 italic bg-gray-100 p-4 rounded-lg">
        No invoice history available
      </p>
      <p v-else class="text-gray-500 italic bg-gray-100 p-4 rounded-lg">
        Select an invoice from history to preview
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Add any styles specific to the right panel here */
</style>