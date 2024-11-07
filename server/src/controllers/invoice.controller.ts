import { Request, Response } from 'express';
import * as invoiceService from '../services/invoice.service';

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const invoiceId = await invoiceService.createInvoice(req.body);
        res.status(201).json({ id: invoiceId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create invoice' });
    }
}

export const deleteInvoice = async (req: Request, res: Response) => {
    try {
        const invoiceId = parseInt(req.params.id);
        await invoiceService.deleteInvoice(invoiceId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
}

export const getInvoicesByStudentId = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = parseInt(req.params.studentId);
        const invoices = await invoiceService.getInvoicesByStudentId(studentId);

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
}

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
    try {
        const invoiceId = parseInt(req.params.id);
        const invoice = await invoiceService.getInvoiceById(invoiceId);
        
        if (!invoice) {
            res.status(404).json({ error: 'Invoice not found' });
            return;
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
}