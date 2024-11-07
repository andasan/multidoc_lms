import { ref } from 'vue'
import { StoredInvoice } from '@/types/invoice.types'
import { generateInvoice } from '@/lib/pdf-generator/invoice'

export function useInvoicePdf() {
    const showPdfModal = ref(false)
    const pdfUrl = ref('')
    const pdfBlob = ref<Blob | null>(null)
    const storedInvoice = ref<StoredInvoice | null>(null)

    const generatePdfBlob = async (invoice: StoredInvoice) => {
        return await generateInvoice({
            invoiceData: invoice.invoice_items,
            programTitle: invoice.program_title,
            companyInfo: invoice.company_info,
            invoiceInfo: invoice.invoice_info,
            enrolmentDate: invoice.enrolment_date,
            invoiceNumber: invoice.invoice_number || ''
        })
    }

    const previewPdf = async (invoice: StoredInvoice) => {
        try {
            pdfBlob.value = await generatePdfBlob(invoice)
            pdfUrl.value = URL.createObjectURL(pdfBlob.value)
            showPdfModal.value = true
        } catch (error) {
            console.error('Failed to generate PDF:', error)
        }
    }

    const downloadPdf = async () => {
        if (!storedInvoice.value) return
        
        try {
            pdfBlob.value = await generatePdfBlob(storedInvoice.value)
            const url = URL.createObjectURL(pdfBlob.value)
            const link = document.createElement('a')
            link.href = url
            link.download = `Invoice-${storedInvoice.value?.invoice_number || 'unnamed'}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Failed to download PDF:', error)
        }
    }

    return {
        storedInvoice,
        showPdfModal,
        pdfUrl,
        previewPdf,
        downloadPdf
    }
}