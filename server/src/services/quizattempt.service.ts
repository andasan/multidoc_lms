import { db, dbPrefix } from '../config/database';
import { QuizAttempt } from '../models/QuizAttempt';

export async function getQuizAttempts(): Promise<QuizAttempt[]> {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT 
                attempts.*, 
                quiz_posts.post_title AS quiz_title,
                course_posts.post_title AS course_title,
                course_meta.meta_value AS course_duration
            FROM 
                ${dbPrefix}tutor_quiz_attempts AS attempts
            JOIN 
                ${dbPrefix}posts AS quiz_posts 
            ON 
                attempts.quiz_id = quiz_posts.ID
            JOIN 
                ${dbPrefix}posts AS course_posts 
            ON 
                attempts.course_id = course_posts.ID
            LEFT JOIN
                ${dbPrefix}postmeta AS course_meta
            ON 
                course_posts.ID = course_meta.post_id
                AND course_meta.meta_key = '_course_duration'
        `, (err, results) => {
            if (err) reject(err);
            else resolve(results as QuizAttempt[]);
        });
    });
}
