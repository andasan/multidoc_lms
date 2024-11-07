import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller';

const router = Router();

router.post('/', invoiceController.createInvoice);
router.get('/student/:studentId', invoiceController.getInvoicesByStudentId);
router.get('/:id', invoiceController.getInvoiceById);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;