<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import { InvoiceItem } from '@/types/invoice.types';

defineProps<{
  presetItems: InvoiceItem[];
}>();

const emit = defineEmits<{
  (e: 'add-preset-item', item: InvoiceItem): void
}>();
</script>

<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-3">Preset Items</h3>
    <div class="bg-blue-50 p-4 rounded-lg border">
      <div class="space-y-2">
        <div v-for="(item, index) in presetItems" :key="index"
          class="p-3 border rounded bg-white hover:bg-gray-50 cursor-pointer group"
          @click="emit('add-preset-item', item)">
          <div class="flex justify-between items-center">
            <span>{{ item.description }} - C${{ item.unitPrice }}</span>
            <svg viewBox="0 0 24 24" class="w-5 h-5 text-gray-400 group-hover:text-gray-600">
              <path :d="mdiPlus" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>