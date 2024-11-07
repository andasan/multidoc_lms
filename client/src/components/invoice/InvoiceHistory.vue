<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

import DocumentPreviewModal from '@/components/shared/DocumentPreviewModal.vue';
import { deleteInvoice } from '@/services/api';
import { useInvoicePdf } from '@/composables/use-invoice-pdf';
import { useDropdown } from '@/composables/use-dropdown';

import { StoredInvoice } from '@/types/invoice.types';

defineProps<{
    previousInvoices: StoredInvoice[];
    selectedInvoice: StoredInvoice | null;
}>();

const emit = defineEmits<{
    (e: 'handle-invoice-select', invoice: StoredInvoice): void
    (e: 'refresh-invoices'): void
    (e: 'reset-editor'): void
}>();

const { showPdfModal, pdfUrl, previewPdf, downloadPdf, storedInvoice } = useInvoicePdf();
const { activeDropdownId, dropdownRefs, closeDropdown, toggleDropdown, handleClickOutside } = useDropdown();

const handleDelete = async (invoice: StoredInvoice, event: Event) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this invoice?')) {
        try {
            await deleteInvoice(invoice.id);
            emit('refresh-invoices');
            emit('reset-editor');
            toast.success('Invoice deleted successfully');
        } catch (error) {
            console.error('Failed to delete invoice:', error);
        }
    }
    closeDropdown();
};

// Event handlers with proper type safety
const handlePreview = async (invoice: StoredInvoice, event: Event) => {
    event.stopPropagation();
    await previewPdf(invoice);
    closeDropdown();
};

const handleDownload = async (invoice: StoredInvoice, event: Event) => {
    event.stopPropagation();
    storedInvoice.value = invoice
    await downloadPdf();
    closeDropdown();
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <h2 class="text-xl font-bold mb-6">Previous Invoices</h2>
    <div v-if="previousInvoices.length === 0" class="text-center py-8 text-gray-500">
        No previous invoices found
    </div>
    <div v-else class="space-y-2 mb-10">
        <div v-for="invoice in previousInvoices" :key="invoice.id" @click="emit('handle-invoice-select', invoice)"
            class="p-4 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{ 'border-blue-500 bg-blue-50': selectedInvoice?.id === invoice.id }">
            <div class="flex justify-between items-center space-x-4">
                <div>
                    <div class="font-medium">{{ invoice.program_title }}</div>
                    <div class="text-sm text-gray-500">
                        {{ new Date(invoice.created_at).toLocaleDateString() }}
                    </div>
                </div>
                <div class="text-gray-700">
                    C${{ invoice.invoice_items.reduce((acc, item) => acc + item.amount, 0).toFixed(2) }}
                </div>

                <div class="relative">
                    <button @click="(event) => toggleDropdown(invoice.id, event)"
                        class="p-1 hover:bg-gray-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    <div :ref="el => { if (el) dropdownRefs.set(invoice.id, el) }"
                        v-show="activeDropdownId === invoice.id"
                        class="absolute right-8 -top-2 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-10 border">
                        <button @click="(event) => handlePreview(invoice, event)"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            Preview PDF
                        </button>
                        <button @click="(event) => handleDownload(invoice, event)"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            Download PDF
                        </button>
                        <button @click="(event) => handleDelete(invoice, event)"
                            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- PDF Preview Modal -->
    <DocumentPreviewModal 
        :is-open="showPdfModal" 
        :pdf-url="pdfUrl" 
        :title="'Invoice'" 
        @close="showPdfModal = false" 
        @download="downloadPdf"
    />
</template>