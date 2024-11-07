export interface QuizAttempt {
    attempt_id: number;
    course_id: number;
    quiz_id: number;
    user_id: number;
    total_questions: number;
    total_answered_questions: number;
    total_marks: string;
    earned_marks: string;
    attempt_info: string;
    attempt_status: string;
    attempt_ip: string;
    attempt_started_at: string;
    attempt_ended_at: string;
    is_manually_reviewed: boolean | null;
    manually_reviewed_at: string | null;
    course_title: string;
    quiz_title: string;
    course_duration: string;
}