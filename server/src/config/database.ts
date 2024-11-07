import mysql from 'mysql2';
import mysql2Promise from 'mysql2/promise';
import dotenv from 'dotenv';
import env from './env';
import { initializeDatabase } from './init-database';

dotenv.config();

const dbConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: parseInt(env.DB_PORT),
    ssl: {
        rejectUnauthorized: true,
        ca: env.DB_CA_CERT,
        required: true
    },
};

export const db = mysql.createPool(dbConfig);

export async function initDb(): Promise<void> {
    try {
        const connection = await mysql2Promise.createConnection(dbConfig);
        console.log('Starting database initialization...');
        await initializeDatabase(connection);
        await connection.end();
        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

export const dbPrefix = env.DB_PREFIX;

export function testDatabaseConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error connecting to database:', err);
                reject(err);
            } else {
                console.log('Successfully connected to database');
                connection.release();
                resolve();
            }
        });
    });
}