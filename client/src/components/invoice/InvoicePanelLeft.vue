<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { mdiPlus, mdiFileDocument } from '@mdi/js';
import { InvoiceItem, StoredInvoice } from '@/types/invoice.types';
import InvoicePresetItems from '@/components/invoice/InvoicePresetItems.vue';
import InvoiceHistory from '@/components/invoice/InvoiceHistory.vue';
import InvoiceItemsList from '@/components/invoice/InvoiceItemsList.vue';

// Define props
const props = defineProps<{
    companyInfoText: string;
    programTitle: string;
    presetItems: any[];
    invoiceItems: InvoiceItem[];
    subtotal: number;
    isLoading: boolean;
    previousInvoices: StoredInvoice[];
    selectedInvoice: any;
    activeTab: 'editor' | 'history';
    handleTabSwitch: (tab: 'editor' | 'history') => void;
    addPresetItem: (item: any) => void;
    removeItem: (index: number) => void;
    updateAmount: (index: number) => void;
    handleInvoiceSelect: (invoice: any) => void;
    resetEditor: () => void;
}>();

// Local state
const isItemOpen = ref<{ [key: number]: boolean }>({});
const draggedItem = ref<number | null>(null);
const dropTarget = ref<number | null>(null);
const dropPosition = ref<'before' | 'after' | null>(null);

// Define emits
const emit = defineEmits<{
    (e: 'update:companyInfoText', value: string): void
    (e: 'update:programTitle', value: string): void
    (e: 'update:invoiceItems', value: any[]): void
    (e: 'add-item', value: InvoiceItem): void
    (e: 'refresh-invoices'): void
}>();

// Methods
const handleAddNewItem = () => {
    emit('add-item', {
        description: '',
        qty: 1,
        unitPrice: 0,
        amount: 0
    });
    // Set the last item to be open after it's added
    nextTick(() => {
        isItemOpen.value[props.invoiceItems.length - 1] = true;
    });
};

const toggleItem = (index: number) => {
    if (props.invoiceItems[index].description) {
        isItemOpen.value[index] = !isItemOpen.value[index];
    }
};

const handleDragStart = (index: number) => {
    draggedItem.value = index;
};

const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem.value === null) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;

    dropTarget.value = index;
    dropPosition.value = e.clientY < midPoint ? 'before' : 'after';
};

const handleDragLeave = () => {
    dropTarget.value = null;
    dropPosition.value = null;
};

const handleDrop = (targetIndex: number) => {
    if (draggedItem.value === null) return;

    const newItems = [...props.invoiceItems];
    const itemToMove = newItems[draggedItem.value];
    newItems.splice(draggedItem.value, 1);

    const adjustedIndex = dropPosition.value === 'after' ? targetIndex + 1 : targetIndex;
    newItems.splice(adjustedIndex, 0, itemToMove);

    emit('update:invoiceItems', newItems);

    draggedItem.value = null;
    dropTarget.value = null;
    dropPosition.value = null;
};
</script>

<template>
    <!-- Tab Headers -->
    <div class="flex border-b">
        <button @click="handleTabSwitch('editor')" class="px-6 py-3 font-medium flex items-center gap-2"
            :class="props.activeTab === 'editor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'">
            <svg viewBox="0 0 24 24" class="w-5 h-5">
                <path :d="mdiPlus" />
            </svg>
            New Invoice
        </button>
        <button @click="handleTabSwitch('history')" class="px-6 py-3 font-medium flex items-center gap-2"
            :class="props.activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'">
            <svg viewBox="0 0 24 24" class="w-5 h-5">
                <path :d="mdiFileDocument" />
            </svg>
            Invoice History
        </button>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- New Invoice Editor -->
        <div v-else-if="props.activeTab === 'editor'">
            <h2 class="text-xl font-bold mb-6">Invoice Editor</h2>

            <!-- Company Info -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-3">Company Info</h3>
                <textarea :value="companyInfoText"
                    @input="(event: Event) => $emit('update:companyInfoText', (event.target as HTMLTextAreaElement).value)"
                    class="w-full h-28 rounded-md border-gray-300 shadow-sm !bg-gray-100 text-sm p-2">
          </textarea>
            </div>

            <!-- Program Info -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-3">Program Info</h3>
                <div class="space-y-2">
                    <input :value="programTitle"
                        @input="(event: Event) => $emit('update:programTitle', (event.target as HTMLInputElement).value)"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm !bg-gray-100 text-sm p-2" />
                </div>
            </div>

            <!-- Preset Items -->
            <InvoicePresetItems :preset-items="presetItems" @add-preset-item="addPresetItem" />

            <!-- Invoice Items -->
            <InvoiceItemsList 
                :invoice-items="invoiceItems"
                :dragged-item="draggedItem"
                :drop-target="dropTarget"
                :drop-position="dropPosition"
                :is-item-open="isItemOpen"
                @drag-start="handleDragStart"
                @drag-over="handleDragOver"
                @drag-leave="handleDragLeave"
                @drop="handleDrop"
                @toggle-item="toggleItem"
                @remove-item="removeItem"
                @update-amount="updateAmount"
                @add-item="handleAddNewItem"
            />
            

            <!-- Totals -->
            <div class="border-t pt-4">
                <div class="text-right">
                    <div class="text-lg font-semibold">
                        Subtotal: C${{ subtotal.toFixed(2) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoice History -->
        <div v-else-if="props.activeTab === 'history'">
            <InvoiceHistory 
                :previous-invoices="previousInvoices" 
                :selected-invoice="selectedInvoice"
                @handle-invoice-select="handleInvoiceSelect" 
                @refresh-invoices="$emit('refresh-invoices')" 
                @reset-editor="resetEditor"
            />
        </div>
    </div>
</template>

<style scoped>
.drop-target {
    @apply border-blue-500 transform transition-all duration-200;
}

/* Animation for list items */
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* Ensure leaving items don't affect layout */
.list-leave-active {
    position: absolute;
}

/* Hover effect for draggable items */
.border.rounded.relative:hover {
    @apply shadow-md transform transition-all duration-200;
}

/* Pulse animation for drop indicators */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Add these new styles */
.tab-enter-active,
.tab-leave-active {
    transition: opacity 0.2s ease;
}

.tab-enter-from,
.tab-leave-to {
    /* opacity: 0; */
}
</style>