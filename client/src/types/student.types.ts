import { QuizAttempt } from '@/types/quiz.types';

export interface Student {
    ID: number;
    user_login: string;
    user_nicename: string;
    user_email: string;
    user_url: string;
    user_registered: string;
    user_activation_key: string;
    user_status: number;
    display_name: string;
    user_role: string | null;
    birthDate: string | null;
    quizAttempts: QuizAttempt[];
    enrollment_date: string | null;
    invoice_number: string | null;
}