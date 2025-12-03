#!/usr/bin/env bun
/**
 * TLS-First Connection Test
 * 
 * Aiven MySQL services require TLS/SSL from the very beginning.
 * This script tests connecting with TLS handshake first.
 */

import mysql2Promise from 'mysql2/promise';
import dotenv from 'dotenv';
import env from '../src/config/env';
import * as tls from 'tls';
import * as net from 'net';

dotenv.config();

function formatCACert(cert: string): string {
    if (!cert) return '';
    return cert
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n')
        .trim();
}

async function testTLSFirst() {
    console.log('\n🔐 Testing TLS-First Connection...\n');
    
    const formattedCert = formatCACert(env.DB_CA_CERT);
    
    // Test 1: Create TLS socket first, then MySQL over it
    console.log('Test 1: Creating TLS socket connection...');
    try {
        const tlsSocket = tls.connect({
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT),
            ca: formattedCert,
            rejectUnauthorized: true,
            servername: env.DB_HOST,
        }, () => {
            console.log('✅ TLS connection established');
            console.log(`   Protocol: ${tlsSocket.getProtocol()}`);
            console.log(`   Cipher: ${tlsSocket.getCipher().name}`);
        });

        tlsSocket.on('error', (err) => {
            console.log(`❌ TLS error: ${err.message}`);
        });

        tlsSocket.on('data', (data) => {
            console.log(`📦 Received ${data.length} bytes over TLS`);
            const firstByte = data[0];
            if (firstByte === 0x0a) {
                console.log('✅ This looks like MySQL protocol over TLS!');
            } else {
                console.log(`   First byte: 0x${firstByte.toString(16).padStart(2, '0')}`);
            }
        });

        await new Promise((resolve) => {
            tlsSocket.on('secureConnect', () => {
                console.log('✅ TLS handshake completed\n');
                tlsSocket.destroy();
                resolve(undefined);
            });
            setTimeout(() => {
                tlsSocket.destroy();
                resolve(undefined);
            }, 3000);
        });
    } catch (error: any) {
        console.log(`❌ TLS connection failed: ${error.message}\n`);
    }

    // Test 2: MySQL connection with SSL required from start
    console.log('Test 2: MySQL connection with SSL required...');
    try {
        const connection = await mysql2Promise.createConnection({
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT),
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            ssl: {
                rejectUnauthorized: true,
                ca: formattedCert,
            },
            // Force SSL mode
            // @ts-ignore - mysql2 might support this
            sslMode: 'REQUIRED',
            connectTimeout: 10000,
        });
        
        // Try a simple query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ MySQL connection successful with SSL!');
        console.log(`   Test query result: ${JSON.stringify(rows)}\n`);
        await connection.end();
    } catch (error: any) {
        console.log(`❌ MySQL connection failed: ${error.message}`);
        console.log(`   Code: ${error.code}`);
        if (error.sqlState) {
            console.log(`   SQL State: ${error.sqlState}`);
        }
        console.log('');
    }

    // Test 3: Try with mysql2's secure connection option
    console.log('Test 3: MySQL connection with secure option...');
    try {
        const mysql = await import('mysql2/promise');
        const connection = await mysql.createConnection({
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT),
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            ssl: {
                rejectUnauthorized: true,
                ca: formattedCert,
            },
            connectTimeout: 10000,
        } as any);
        
        const [rows] = await connection.execute('SELECT VERSION() as version');
        console.log('✅ MySQL connection successful!');
        console.log(`   MySQL version: ${JSON.stringify(rows)}\n`);
        await connection.end();
    } catch (error: any) {
        console.log(`❌ Connection failed: ${error.message}`);
        console.log(`   Code: ${error.code}\n`);
    }
}

testTLSFirst().catch(console.error);

