import { InvoiceInfoField } from '@/types/invoice.types';

export const PRESET_INVOICE_ITEMS = [
    { description: 'Registration Fee (Non-refundable)', qty: 1, unitPrice: 150.00, amount: 150.00 },
    { description: 'Tuition Fee including Scholarship (Non-refundable)', qty: 1, unitPrice: 2850.00, amount: 2850.00 },
];

export const INVOICE_INFO_FIELDS: InvoiceInfoField[] = [
  {
    id: 'invoice_number',
    label: 'Invoice #:',
    getValue: ({ invoice }) => invoice?.invoice_number || 'Generated on Save',
  },
  {
    id: 'bill_to',
    label: 'Bill to:',
    getValue: ({ student }) => student?.display_name || 'N/A',
  },
  {
    id: 'email',
    label: 'Email:',
    getValue: ({ student }) => student?.user_email || 'N/A',
  },
  {
    id: 'date_paid',
    label: 'Date Paid:',
    getValue: ({ datePaid }) => datePaid || 'N/A',
  },
  {
    id: 'payment_method',
    label: 'Payment Method:',
    getValue: () => 'Agent',
    defaultValue: 'Agent',
  }
];