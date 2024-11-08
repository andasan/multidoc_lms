<script setup lang="ts">
import { InvoiceItem } from '@/types/invoice.types';
import { mdiChevronDown, mdiDrag } from '@mdi/js';

defineProps<{
    invoiceItems: InvoiceItem[];
    draggedItem: number | null;
    dropTarget: number | null;
    dropPosition: 'before' | 'after' | null;
    isItemOpen: { [key: number]: boolean };
}>();

const emit = defineEmits<{
  (e: 'drag-start', index: number): void
  (e: 'drag-over', event: DragEvent, index: number): void
  (e: 'drag-leave'): void
  (e: 'drop', index: number): void
  (e: 'toggle-item', index: number): void
  (e: 'remove-item', index: number): void
  (e: 'update-amount', index: number): void
  (e: 'add-item'): void
}>();

</script>

<template>
    <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Invoice Items</h3>
        <div class="space-y-4">
            <TransitionGroup name="list" tag="div" class="space-y-4">
                <div v-for="(item, index) in invoiceItems" :key="index"
                    class="border rounded relative transition-all duration-200" :class="{
                        'opacity-50 scale-[0.98] rotate-1': draggedItem === index,
                        'drop-target shadow-lg': dropTarget === index
                    }" draggable="true" @dragstart="emit('drag-start', index)"
                    @dragover="emit('drag-over', $event, index)" @dragleave="emit('drag-leave')" @drop="emit('drop', index)">
                    
                    <div v-if="dropTarget === index && dropPosition === 'before'"
                        class="absolute w-full h-1 bg-blue-500 -top-1 z-10 animate-pulse"></div>
                    <div v-if="dropTarget === index && dropPosition === 'after'"
                        class="absolute w-full h-1 bg-blue-500 -bottom-1 z-10 animate-pulse"></div>

                    <!-- Accordion Header -->
                    <div @click="emit('toggle-item', index)"
                        class="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                        <div class="flex-1 flex items-center">
                            <svg viewBox="0 0 24 24" class="w-5 h-5 mr-2 cursor-move text-gray-400 hover:text-gray-600"
                                @click.stop>
                                <path :d="mdiDrag" />
                            </svg>
                            <svg viewBox="0 0 24 24" class="w-5 h-5 mr-2 transition-transform duration-200"
                                :class="{ 'rotate-180': isItemOpen[index] }">
                                <path :d="mdiChevronDown" />
                            </svg>
                            <span v-if="item.description">
                                {{ item.description }} - C${{ item.amount.toFixed(2) }}
                            </span>
                            <span v-else class="text-gray-400">
                                New Item
                            </span>
                        </div>
                        <button @click.stop="emit('remove-item', index)" class="text-red-600 text-sm hover:text-red-800">
                            Remove
                        </button>
                    </div>

                    <!-- Accordion Content -->
                    <div v-show="!item.description || isItemOpen[index]" class="p-4 border-t">
                        <div class="space-y-2">
                            <div class="grid grid-cols-1 gap-4">
                                <div class="w-full">
                                    <label class="block text-sm font-medium text-gray-700">Description</label>
                                    <input v-model="item.description" type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm !bg-gray-100 text-sm p-2" />
                                </div>
                                <div class="grid gap-4"
                                    style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Qty</label>
                                        <input v-model.number="item.qty" type="number" @input="emit('update-amount', index)"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm !bg-gray-100 text-sm p-2" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Unit
                                            Price</label>
                                        <input v-model.number="item.unitPrice" type="number"
                                            @input="emit('update-amount', index)"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm !bg-gray-100 text-sm p-2" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Amount</label>
                                        <div class="mt-1">C${{ item.amount.toFixed(2) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TransitionGroup>
        </div>
        <button @click="emit('add-item')" class="mt-4 text-blue-600">
            + Add Item
        </button>
    </div>
</template>
