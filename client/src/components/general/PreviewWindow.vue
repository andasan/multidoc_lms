<script setup lang="ts">
import { computed } from 'vue'

import { 
    HEADER_LOGO_CONFIG, 
    FOOTER_LOGO_CONFIG, 
    FOOTER_TEXT 
} from '@/constants/doc-elements.constants'
import { InvoiceItem, InvoiceInfo } from '@/types/invoice.types'
import { CompanyInfoItem } from '@/types/company.types'
import { Student } from '@/types/student.types'

const props = defineProps<{
    student: Student;
    subtotal: number;
    invoiceItems: InvoiceItem[];
    companyInfo: CompanyInfoItem[];
    programTitle: string;
    invoiceInfo: InvoiceInfo[];
}>()

// Create a computed property for the subtotal to ensure reactivity
const computedSubtotal = computed(() => props.subtotal)

// Format currency helper
const formatCurrency = (amount: number) => {
    return `C$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

</script>

<template>
    <div class="preview-container p-8 bg-white shadow-lg">
        <img :src="HEADER_LOGO_CONFIG.src" :alt="HEADER_LOGO_CONFIG.alt" class="w-1/2 mb-8">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1 class="text-2xl font-bold text-primary text-right">INVOICE</h1>
        </div>

        <!-- Invoice Info Section -->
        <table class="w-full mb-8">
            <tbody>
                <tr>
                    <td>
                        <template v-for="info in companyInfo" :key="info.text">
                            <p :class="{ 'font-bold': info.bold }">{{ info.text }}</p>
                        </template>
                    </td>
                    <td>
                        <table class="w-full">
                            <tbody>
                                <tr v-for="(item, index) in invoiceInfo" 
                                    :key="item.label" 
                                >
                                    <td class="text-right font-bold">{{ item.label }}</td>
                                    <td 
                                        class="text-right"
                                        :class="{ 
                                            'italic': index === 0 
                                        }"
                                    >{{ item.value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="h-16"></div>
        
        <!-- Program Title -->
        <div class="mb-6">
            <h3 class="font-bold text-primary">{{ programTitle }}</h3>
        </div>

        <div class="h-6"></div>

        <!-- Invoice Table -->
        <table class="w-full mb-8">
            <thead>
                <tr class="border-b">
                    <th class="text-left py-2">Description</th>
                    <th class="text-right py-2">Qty</th>
                    <th class="text-right py-2 w-1/4">Unit Price</th>
                    <th class="text-right py-2 w-1/4">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in invoiceItems" 
                    :key="item.description" 
                    class="border-b"
                >
                    <td class="py-2">{{ item.description }}</td>
                    <td class="text-right py-2">{{ item.qty }}</td>
                    <td class="text-right py-2">{{ formatCurrency(item.unitPrice) }}</td>
                    <td class="text-right py-2">{{ formatCurrency(item.amount) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Summary Table -->
        <div class="w-1/2 ml-auto">
            <div class="flex justify-between border-b py-2">
                <span class="w-1/2 text-right font-bold">Subtotal:</span>
                <span class="w-1/2 text-right">{{ formatCurrency(computedSubtotal) }}</span>
            </div>
            <div class="flex justify-between border-b py-2">
                <span class="w-1/2 text-right font-bold">Total:</span>
                <span class="w-1/2 text-right">{{ formatCurrency(computedSubtotal) }}</span>
            </div>
            <div class="flex justify-between border-b py-2">
                <span class="w-1/2 text-right font-bold">Amount Paid:</span>
                <span class="w-1/2 text-right">{{ formatCurrency(computedSubtotal) }}</span>
            </div>
        </div>

        <div class="h-16"></div>


        <img :src="FOOTER_LOGO_CONFIG.src" :alt="FOOTER_LOGO_CONFIG.alt" class="w-14 mx-auto mt-8">
        <p class="text-center">{{ FOOTER_TEXT[0] }}</p>
    </div>
</template>

<style scoped>
.preview-container {
    min-height: 800px;
    font-family: 'Times New Roman', Times, serif;
    color: #122580;
}

.text-primary {
    color: rgb(18, 38, 128); /* Matches the PDF primary color */
}
</style>