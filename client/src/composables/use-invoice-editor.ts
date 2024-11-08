import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import type { InvoiceItem, StoredInvoice, CreateInvoiceData } from '@/types/invoice.types'
import type { CompanyInfoItem } from '@/types/company.types'
import { saveInvoice } from '@/services/api'
import { COMPANY_INFO } from '@/constants/company.constants'
import { PRESET_INVOICE_ITEMS } from '@/constants/invoice.constants'
import { Student } from '@/types/student.types'
import { COURSES } from '@/constants/courses.constants'

export function useInvoiceEditor() {

  /* ********************************
   *  State Management 
   ******************************* */
  const isLoading = ref(false)
  const showPdfModal = ref(false);
  const companyInfo = ref<CompanyInfoItem[]>(COMPANY_INFO)
  const programTitle = ref('')

  // Invoice Items
  const invoiceItems = ref<InvoiceItem[]>([])
  const presetItems = ref<InvoiceItem[]>(PRESET_INVOICE_ITEMS)

  // Invoice History
  const previousInvoices = ref<StoredInvoice[]>([])
  const selectedInvoice = ref<StoredInvoice | null>(null)

  // Computed Values
  const subtotal = computed(() =>
    invoiceItems.value.reduce((sum, item) => sum + item.amount, 0)
  )

  const companyInfoText = computed({
    get: () => companyInfo.value.map(item => item.text).join('\n'),
    set: (newValue: string) => {
      companyInfo.value = newValue.split('\n').map(text => ({ text, bold: false }))
    }
  })

  // Helper function to determine program title
  const setProgramTitle = (courseId: number) => {
    const course = COURSES.find(c => c.id === courseId);

    if (course) {
      programTitle.value = `${course.title}`;
    } else {
      // Fallback to existing logic if no courseId is found
      programTitle.value = `${courseId}`;
    }
  };

  // Methods
  const addPresetItem = (item: InvoiceItem) => {
    invoiceItems.value.push({ ...item })
  }

  const addNewItem = () => {
    invoiceItems.value.push({
      description: '',
      qty: 1,
      unitPrice: 0,
      amount: 0
    })
  }

  const removeItem = (index: number) => {
    invoiceItems.value.splice(index, 1)
  }

  const updateAmount = (index: number) => {
    const item = invoiceItems.value[index]
    item.amount = item.qty * item.unitPrice
  }

  const handleSave = async (student: Student) => {
    // Validate student
    if (!student?.ID) {
      toast.error('Student ID is required')
      return
    }

    // Validate enrolment date
    if (!student?.enrollment_date) {
      toast.error('Enrolment date is required')
      return
    }

    // Validate invoice items
    if (invoiceItems.value.length === 0) {
      toast.error('Please add at least one invoice item')
      return
    }

    // Validate company info
    if (companyInfo.value.length === 0 || companyInfo.value.every(item => !item.text.trim())) {
      toast.error('Company information cannot be empty')
      return
    }

    // Validate program title
    if (!programTitle.value.trim()) {
      toast.error('Program title cannot be empty')
      return
    }

    // Validate invoice items details
    const invalidItems = invoiceItems.value.some(item =>
      !item.description.trim() ||
      item.qty <= 0 ||
      item.unitPrice <= 0
    )

    if (invalidItems) {
      toast.error('All invoice items must have a description, quantity, and price greater than 0')
      return
    }

    try {
      const invoiceData: CreateInvoiceData = {
        student_id: student.ID,
        program_title: programTitle.value,
        company_info: JSON.stringify(companyInfo.value),
        invoice_info: JSON.stringify([]), // This would need to be passed in or handled differently
        invoice_items: JSON.stringify(invoiceItems.value),
        enrolment_date: student.enrollment_date
      }

      await saveInvoice(invoiceData)
      toast.success('Invoice saved successfully')
    } catch (error) {
      console.error('Failed to save invoice:', error)
      toast.error('Failed to save invoice')
    }
  }

  const resetEditor = () => {
    selectedInvoice.value = null
    invoiceItems.value = []
  }

  return {
    // State
    isLoading,
    showPdfModal,
    invoiceItems,
    companyInfo,
    programTitle,
    presetItems,
    previousInvoices,
    selectedInvoice,
    companyInfoText,
    subtotal,

    // Helper functions
    setProgramTitle,

    // Methods
    addPresetItem,
    addNewItem,
    removeItem,
    updateAmount,
    handleSave,
    resetEditor
  }
}