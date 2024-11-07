import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import * as submissionService from '../services/submission.service';
import * as quizAttemptService from '../services/quizattempt.service';
import * as invoiceService from '../services/invoice.service';
export async function getAllUsers(req: Request, res: Response) {
    try {
        const [users, submissions, quizAttempts, invoices] = await Promise.all([
            userService.getUsers(),
            submissionService.getSubmissions(),
            quizAttemptService.getQuizAttempts(),
            invoiceService.getInvoices()
        ]);
        
        const mergedResults = users.map(user => ({
            ...user,
            birthDate: submissions.find(submission => submission.user_email === user.user_email)?.birthDate || null,
            quizAttempts: quizAttempts.filter(attempt => attempt.user_id === user.ID),
            invoice_number: invoices.find(invoice => invoice.student_id === user.ID)?.invoice_number || null
        }));

        res.json(mergedResults);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

export async function getUserById(req: Request, res: Response) {
    const { id } = req.params;
    
    //get user by id with submissions and quiz attempts
    try{
        const [user, submissions, quizAttempts, invoices] = await Promise.all([
            userService.getUserById(parseInt(id)),
            submissionService.getSubmissions(),
            quizAttemptService.getQuizAttempts(),
            invoiceService.getInvoices()
        ]);

        const mergedResults = {
            ...user,
            birthDate: submissions.find(submission => submission.user_email === user?.user_email)?.birthDate || null,
            quizAttempts: quizAttempts.filter(attempt => attempt.user_id === user?.ID),
            invoice_number: invoices.find(invoice => invoice.student_id === user?.ID)?.invoice_number || null
        };
        res.json(mergedResults);

    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}