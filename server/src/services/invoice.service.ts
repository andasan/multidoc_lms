import { db, dbPrefix } from '../config/database';
import { Invoice, InvoiceCreate } from '../models/Invoice';
import { calculateBusinessDate } from '../utils/date-utils';
import { promisify } from 'util';

// Promisify the db.query method
const queryAsync = promisify(db.query).bind(db);

export async function generateInvoiceNumber(): Promise<string> {
    const businessDate = calculateBusinessDate(new Date());
    const datePrefix = `${businessDate.year}${businessDate.month}${businessDate.day}`;
    
    const results = await queryAsync(
        `SELECT invoice_number FROM ${dbPrefix}invoices WHERE invoice_number LIKE ? ORDER BY created_at DESC LIMIT 1`,
        [`${datePrefix}%`]
    );
    
    let nextSegmentD = '0001';
    if (results[0]?.invoice_number) {
        const currentSegmentD = results[0].invoice_number.split('-')[1];
        nextSegmentD = (parseInt(currentSegmentD) + 1).toString().padStart(4, '0');
    }
    
    return `${datePrefix}-${nextSegmentD}`;
}

export async function createInvoice(invoice: InvoiceCreate): Promise<number> {
    const invoiceNumber = await generateInvoiceNumber();
    
    const result = await queryAsync(
        `INSERT INTO ${dbPrefix}invoices (student_id, invoice_number, program_title, company_info, invoice_info, invoice_items) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            invoice.student_id,
            invoiceNumber,
            invoice.program_title,
            invoice.company_info,
            invoice.invoice_info,
            invoice.invoice_items
        ]
    );
    
    return result.insertId;
}

export async function deleteInvoice(invoiceId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ${dbPrefix}invoices WHERE id = ?`, [invoiceId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export async function getInvoices(): Promise<Invoice[]> {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${dbPrefix}invoices`, (err, results: any[]) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

export async function getInvoicesByStudentId(studentId: number): Promise<Invoice[]> {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${dbPrefix}invoices WHERE student_id = ?`, [studentId], (err, results: any[]) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

export async function getInvoiceById(invoiceId: number): Promise<Invoice> {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${dbPrefix}invoices WHERE id = ?`, [invoiceId], (err, results: any[]) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
}