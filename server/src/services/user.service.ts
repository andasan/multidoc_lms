import { db, dbPrefix } from '../config/database';
import { User } from '../models/User';

export async function getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.ID, u.user_login, u.user_nicename, u.user_email, u.user_url, 
                   u.user_registered, u.user_activation_key, u.user_status, u.display_name,
                   SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value, '"', -2), '"', 1) AS user_role,
                   DATE_FORMAT(MIN(p.post_date), '%Y-%m-%d %H:%i:%s') as enrollment_date
            FROM ${dbPrefix}users u
            LEFT JOIN ${dbPrefix}usermeta m ON u.ID = m.user_id AND m.meta_key = '${dbPrefix}capabilities'
            LEFT JOIN ${dbPrefix}posts p ON u.ID = p.post_author
            GROUP BY u.ID, u.user_login, u.user_nicename, u.user_email, u.user_url, 
                     u.user_registered, u.user_activation_key, u.user_status, u.display_name,
                     m.meta_value
        `;
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results as User[]);
        });
    });
}

export async function getUserById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.ID, u.user_login, u.user_nicename, u.user_email, u.user_url, 
                   u.user_registered, u.user_activation_key, u.user_status, u.display_name,
                   SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value, '"', -2), '"', 1) AS user_role,
                   DATE_FORMAT(MIN(p.post_date), '%Y-%m-%d %H:%i:%s') as enrollment_date
            FROM ${dbPrefix}users u
            LEFT JOIN ${dbPrefix}usermeta m ON u.ID = m.user_id AND m.meta_key = '${dbPrefix}capabilities'
            LEFT JOIN ${dbPrefix}posts p ON u.ID = p.post_author
            WHERE u.ID = ?
            GROUP BY u.ID, u.user_login, u.user_nicename, u.user_email, u.user_url, 
                     u.user_registered, u.user_activation_key, u.user_status, u.display_name,
                     m.meta_value
        `;
        db.query(query, [id], (err, results) => {
            if (err) reject(err);
            else resolve(results[0] as User);
        });
    });
}