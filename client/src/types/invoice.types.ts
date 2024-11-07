export interface InvoiceItem {
    description: string;
    qty: number;
    unitPrice: number;
    amount: number;
}

export interface CompanyInfo {
    text: string;
    bold: boolean;
}

export interface InvoiceInfo {
    label: string;
    value: string;
}

export interface CreateInvoiceData {
    student_id: number;
    program_title: string;
    company_info: string;
    invoice_info: string;
    invoice_items: string;
    enrolment_date: string;
}

export interface StoredInvoice {
    id: number;
    student_id: number;
    invoice_number: string;
    program_title: string;
    company_info: CompanyInfo[];
    invoice_info: InvoiceInfo[];
    invoice_items: InvoiceItem[];
    created_at: string;
    updated_at: string;
    enrolment_date: string;
}

export type InvoiceMode = 'editor' | 'history';

export interface InvoiceState {
    invoiceItems: InvoiceItem[];
    companyInfo: CompanyInfo[];
    programTitle: string;
}

export interface InvoiceInfoField {
    id: string;
    label: string;
    getValue: (data: {
        invoice?: StoredInvoice | null;
        student?: any;
        datePaid?: string;
    }) => string;
    defaultValue?: string;
}