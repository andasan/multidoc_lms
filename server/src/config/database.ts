import mysql from 'mysql2';
import mysql2Promise from 'mysql2/promise';
import dotenv from 'dotenv';
import env from './env';
import { initializeDatabase } from './init-database';

dotenv.config();

// Helper function to format CA certificate properly
function formatCACert(cert: string): string {
    if (!cert) return '';
    // Remove any existing newline characters, extra blank lines, and ensure proper formatting
    return cert
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .filter(line => line.trim().length > 0) // Remove empty lines
        .join('\n')
        .trim();
}

// Build SSL config - Aiven MySQL requires SSL from the start
// Always use SSL if certificate is provided
let sslConfig: any = false;
if (env.DB_CA_CERT) {
    try {
        const formattedCert = formatCACert(env.DB_CA_CERT);
        if (formattedCert) {
            sslConfig = {
                rejectUnauthorized: true,
                ca: formattedCert,
            };
            console.log('SSL configuration: Using CA certificate for secure connection');
        } else {
            console.warn('Warning: CA certificate is empty, connection may fail');
        }
    } catch (error) {
        console.warn('Warning: Could not parse CA certificate, attempting connection without SSL verification');
        // Even if cert parsing fails, try with SSL but without verification
        // Aiven requires SSL, so we can't disable it completely
        sslConfig = {
            rejectUnauthorized: false,
        };
    }
} else {
    console.warn('Warning: No CA certificate provided. Aiven MySQL requires SSL - connection will likely fail');
}

const dbConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: parseInt(env.DB_PORT),
    ssl: sslConfig,
    connectTimeout: 10000, // 10 second timeout
    // Add connection retry settings
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
};

// Log connection details (without sensitive info)
console.log(`Attempting to connect to database: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME} as ${env.DB_USER}`);

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
                
                // Provide helpful error messages for common issues
                if (err.code === 'ERR_OUT_OF_RANGE' || err.message?.includes('offset')) {
                    console.error('\n⚠️  Connection protocol error detected. This usually means:');
                    console.error('   1. The host/port might be incorrect or pointing to a non-MySQL service');
                    console.error('   2. The SSL certificate might be malformed');
                    console.error('   3. There might be a proxy or firewall interfering');
                    console.error('\n   Please verify:');
                    console.error(`   - Host: ${env.DB_HOST}`);
                    console.error(`   - Port: ${env.DB_PORT}`);
                    console.error(`   - Database: ${env.DB_NAME}`);
                    console.error('   - CA Certificate is properly formatted with line breaks');
                } else if (err.code === 'ECONNREFUSED') {
                    console.error('\n⚠️  Connection refused. Check:');
                    console.error('   - The database service is running in Aiven');
                    console.error('   - The host and port are correct');
                    console.error('   - Your IP is whitelisted (if required)');
                } else if (err.code === 'ENOTFOUND') {
                    console.error('\n⚠️  Host not found. Check:');
                    console.error(`   - Host name "${env.DB_HOST}" is correct`);
                } else if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
                    console.error('\n⚠️  Authentication error. Check:');
                    console.error('   - Username and password are correct');
                    console.error('   - User has proper permissions');
                }
                
                reject(err);
            } else {
                console.log('✅ Successfully connected to database');
                connection.release();
                resolve();
            }
        });
    });
}