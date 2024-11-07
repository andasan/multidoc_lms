import { db, dbPrefix } from '../config/database';
import { Quiz } from '../models/Quiz';

export async function getQuizzes(): Promise<Quiz[]> {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${dbPrefix}posts WHERE post_type = 'tutor_quiz'`, (err, results) => {
            if (err) reject(err);
            else resolve(results as Quiz[]);
        });
    });
}