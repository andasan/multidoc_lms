#!/usr/bin/env bun
/**
 * Database Connection Test Script
 * 
 * This script helps debug database connection issues by testing
 * the connection with detailed error messages.
 * 
 * Usage: bun test-connection.ts
 */

import mysql2Promise from 'mysql2/promise';
import dotenv from 'dotenv';
import env from '../src/config/env';

dotenv.config();

async function testConnection() {
    console.log('\n🔍 Testing Database Connection...\n');
    console.log('Connection Details:');
    console.log(`  Host: ${env.DB_HOST}`);
    console.log(`  Port: ${env.DB_PORT}`);
    console.log(`  Database: ${env.DB_NAME}`);
    console.log(`  User: ${env.DB_USER}`);
    console.log(`  Password: ${env.DB_PASSWORD ? '***' : 'NOT SET'}`);
    console.log(`  CA Cert: ${env.DB_CA_CERT ? `${env.DB_CA_CERT.length} characters` : 'NOT SET'}`);
    console.log(`  Prefix: ${env.DB_PREFIX}\n`);

    // Test 1: Basic connection without SSL
    console.log('Test 1: Attempting connection without SSL...');
    try {
        const connection1 = await mysql2Promise.createConnection({
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT),
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            ssl: false,
            connectTimeout: 5000,
        });
        console.log('✅ Connection successful without SSL\n');
        await connection1.end();
    } catch (error: any) {
        console.log('❌ Connection failed without SSL');
        console.log(`   Error: ${error.message}`);
        console.log(`   Code: ${error.code}\n`);
    }

    // Test 2: Connection with SSL (if CA cert is provided)
    if (env.DB_CA_CERT) {
        console.log('Test 2: Attempting connection with SSL...');
        try {
            // Clean up certificate - remove extra blank lines
            const formattedCert = env.DB_CA_CERT
                .replace(/\r\n/g, '\n')
                .replace(/\r/g, '\n')
                .split('\n')
                .filter(line => line.trim().length > 0) // Remove empty lines
                .join('\n')
                .trim();
            
            console.log(`   Certificate length: ${formattedCert.length} chars`);
            console.log(`   Certificate starts with: ${formattedCert.substring(0, 30)}...`);

            const connection2 = await mysql2Promise.createConnection({
                host: env.DB_HOST,
                port: parseInt(env.DB_PORT),
                user: env.DB_USER,
                password: env.DB_PASSWORD,
                database: env.DB_NAME,
                ssl: {
                    rejectUnauthorized: true,
                    ca: formattedCert,
                },
                connectTimeout: 5000,
            });
            console.log('✅ Connection successful with SSL\n');
            await connection2.end();
        } catch (error: any) {
            console.log('❌ Connection failed with SSL');
            console.log(`   Error: ${error.message}`);
            console.log(`   Code: ${error.code}\n`);
        }
    }

    // Test 3: Connection with SSL but without verification
    console.log('Test 3: Attempting connection with SSL (no verification)...');
    try {
        const connection3 = await mysql2Promise.createConnection({
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT),
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            ssl: {
                rejectUnauthorized: false,
            },
            connectTimeout: 5000,
        });
        console.log('✅ Connection successful with SSL (no verification)\n');
        await connection3.end();
    } catch (error: any) {
        console.log('❌ Connection failed even without SSL verification');
        console.log(`   Error: ${error.message}`);
        console.log(`   Code: ${error.code}\n`);
    }

    // Test 4: Verify host/port accessibility and check protocol
    console.log('Test 4: Checking if host/port is accessible and what protocol it serves...');
    try {
        const net = await import('net');
        const socket = new net.Socket();
        const timeout = 5000;
        let receivedData = Buffer.alloc(0);
        
        await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => {
                socket.destroy();
                reject(new Error('Connection timeout'));
            }, timeout);

            socket.on('data', (data) => {
                receivedData = Buffer.concat([receivedData, data]);
                // Check first few bytes to identify protocol
                if (receivedData.length >= 4) {
                    const firstByte = receivedData[0];
                    const packetLength = receivedData.readUIntLE(0, 3);
                    console.log(`   First byte: 0x${firstByte.toString(16)} (${firstByte})`);
                    console.log(`   Packet length (if MySQL): ${packetLength}`);
                    
                    // MySQL handshake packet typically starts with protocol version (0x0a)
                    // or has a specific structure
                    if (firstByte === 0x0a || (firstByte >= 0x00 && firstByte <= 0xff && packetLength < 1000)) {
                        console.log('   ⚠️  This might be a MySQL protocol response');
                    } else {
                        console.log('   ⚠️  This does NOT look like MySQL protocol');
                        console.log(`   First 20 bytes: ${receivedData.slice(0, 20).toString('hex')}`);
                        if (receivedData.toString('utf8', 0, Math.min(50, receivedData.length)).includes('HTTP')) {
                            console.log('   ⚠️  This appears to be an HTTP response!');
                        }
                    }
                }
            });

            socket.connect(parseInt(env.DB_PORT), env.DB_HOST, () => {
                clearTimeout(timer);
                // Give it a moment to receive initial handshake
                setTimeout(() => {
                    socket.destroy();
                    resolve();
                }, 100);
            });

            socket.on('error', (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });
        
        console.log('✅ Host and port are accessible\n');
    } catch (error: any) {
        console.log('❌ Cannot reach host/port');
        console.log(`   Error: ${error.message}`);
        console.log(`   This might mean:`);
        console.log(`   - The service is not running`);
        console.log(`   - The host/port is incorrect`);
        console.log(`   - A firewall is blocking the connection\n`);
    }
    
    // Test 5: Try with different MySQL connection options
    console.log('Test 5: Attempting connection with additional MySQL options...');
    try {
        const formattedCert = env.DB_CA_CERT
            ? env.DB_CA_CERT
                .replace(/\r\n/g, '\n')
                .replace(/\r/g, '\n')
                .split('\n')
                .filter(line => line.trim().length > 0)
                .join('\n')
                .trim()
            : undefined;

        const connection5 = await mysql2Promise.createConnection({
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT),
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME,
            ssl: formattedCert ? {
                rejectUnauthorized: true,
                ca: formattedCert,
            } : {
                rejectUnauthorized: false,
            },
            connectTimeout: 10000,
            // Additional options that might help
            authSwitchHandler: (data, cb) => {
                // Handle auth switch if needed
                cb();
            },
            // Force SSL
            sslMode: 'REQUIRED',
        } as any);
        console.log('✅ Connection successful with additional options\n');
        await connection5.end();
    } catch (error: any) {
        console.log('❌ Connection failed with additional options');
        console.log(`   Error: ${error.message}`);
        console.log(`   Code: ${error.code}`);
        if (error.code) {
            console.log(`   SQL State: ${error.sqlState || 'N/A'}`);
        }
        console.log('');
    }

    console.log('\n💡 Troubleshooting Tips:');
    console.log('   1. Verify your Aiven service is running');
    console.log('   2. Double-check host, port, username, and password');
    console.log('   3. Ensure CA certificate is properly formatted with line breaks');
    console.log('   4. Check if your IP needs to be whitelisted in Aiven');
    console.log('   5. Try the connection string from Aiven console\n');
}

testConnection().catch(console.error);

