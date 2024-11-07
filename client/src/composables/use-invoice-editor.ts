import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import type { InvoiceItem, CompanyInfo } from '@/types/invoice.types'

export function useInvoiceEditor() {
  const invoiceItems = ref<InvoiceItem[]>([])
  const companyInfo = ref<CompanyInfo[]>([])
  const programTitle = ref('')
  const isLoading = ref(false)

  const subtotal = computed(() => 
    invoiceItems.value.reduce((sum, item) => sum + item.amount, 0)
  )

  const validateInvoice = () => {
    if (invoiceItems.value.length === 0) {
      // throw new Error('Please add at least one invoice item')
      toast.error('Please add at least one invoice item')
    }

    if (companyInfo.value.length === 0) {
      // throw new Error('Company information cannot be empty')
      toast.error('Company information cannot be empty')
    }

    if (!programTitle.value.trim()) {
      // throw new Error('Program title cannot be empty')
      toast.error('Program title cannot be empty')
    }

    const invalidItems = invoiceItems.value.some(item => 
      !item.description.trim() || 
      item.qty <= 0 || 
      item.unitPrice <= 0
    )

    if (invalidItems) {
      // throw new Error('All invoice items must have a description, quantity, and price greater than 0')
      toast.error('All invoice items must have a description, quantity, and price greater than 0')
    }
  }

  const addItem = (item?: Partial<InvoiceItem>) => {
    invoiceItems.value.push({
      description: item?.description || '',
      qty: item?.qty || 1,
      unitPrice: item?.unitPrice || 0,
      amount: item?.amount || 0
    })
  }

  const removeItem = (index: number) => {
    invoiceItems.value.splice(index, 1)
  }

  const updateAmount = (index: number) => {
    const item = invoiceItems.value[index]
    item.amount = item.qty * item.unitPrice
  }

  return {
    invoiceItems,
    companyInfo,
    programTitle,
    isLoading,
    subtotal,
    validateInvoice,
    addItem,
    removeItem,
    updateAmount
  }
}