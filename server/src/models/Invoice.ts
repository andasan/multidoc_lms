export interface Invoice {
    id?: number;
    student_id: number;
    invoice_number: string;
    program_title: string;
    company_info: string;
    invoice_info: string;
    invoice_items: string;
    created_at?: string;
    updated_at?: string;
}

export interface InvoiceCreate extends Omit<Invoice, 'id' | 'created_at' | 'updated_at'> {}