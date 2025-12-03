#!/usr/bin/env bun
/**
 * Service Type Checker
 * 
 * This script helps identify what type of service is running
 * on the specified host/port to help debug connection issues.
 */

import dotenv from 'dotenv';
import env from '../src/config/env';
import * as net from 'net';

dotenv.config();

async function checkServiceType() {
    console.log('\n🔍 Checking Service Type...\n');
    console.log(`Connecting to: ${env.DB_HOST}:${env.DB_PORT}\n`);

    return new Promise<void>((resolve) => {
        const socket = new net.Socket();
        let dataReceived = false;
        const timeout = 5000;

        const timer = setTimeout(() => {
            if (!dataReceived) {
                console.log('❌ No response received (timeout)\n');
            }
            socket.destroy();
            resolve();
        }, timeout);

        socket.on('data', (data: Buffer) => {
            dataReceived = true;
            clearTimeout(timer);
            
            console.log(`📦 Received ${data.length} bytes\n`);
            console.log('First 100 bytes (hex):');
            console.log(data.slice(0, 100).toString('hex').match(/.{2}/g)?.join(' ') || '');
            console.log('\nFirst 100 bytes (ascii, non-printable shown as .):');
            const ascii = Array.from(data.slice(0, 100))
                .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
                .join('');
            console.log(ascii);
            console.log('\n');

            // Try to identify the protocol
            const firstByte = data[0];
            const firstFourBytes = data.slice(0, 4);
            
            console.log('🔍 Protocol Analysis:');
            console.log(`   First byte: 0x${firstByte.toString(16).padStart(2, '0')} (${firstByte})`);
            console.log(`   Total bytes received: ${data.length}`);
            
            // Check if this could be a MySQL error packet
            // MySQL error packets start with 0xff
            if (firstByte === 0xff) {
                console.log('   ⚠️  This is a MySQL ERROR packet!');
                if (data.length >= 9) {
                    const errorCode = data.readUInt16LE(1);
                    const sqlStateMarker = data[3];
                    const sqlState = data.slice(4, 9).toString('ascii');
                    const errorMessage = data.slice(9).toString('utf8');
                    console.log(`   Error Code: ${errorCode}`);
                    console.log(`   SQL State: ${sqlState}`);
                    console.log(`   Error Message: ${errorMessage}`);
                }
            }
            // MySQL handshake typically starts with protocol version (0x0a = 10)
            // But the packet length comes first (3 bytes little-endian)
            else if (data.length >= 4) {
                const packetLength = data.readUIntLE(0, 3);
                const sequenceId = data[3];
                
                if (packetLength > 0 && packetLength < 10000 && data.length >= packetLength + 4) {
                    console.log(`   📦 MySQL packet detected`);
                    console.log(`   Packet length: ${packetLength} bytes`);
                    console.log(`   Sequence ID: ${sequenceId}`);
                    
                    if (data.length > 4) {
                        const protocolVersion = data[4];
                        if (protocolVersion === 0x0a) {
                            console.log('   ✅ This is a MySQL handshake packet (protocol version 10)');
                        } else {
                            console.log(`   ⚠️  Protocol version: ${protocolVersion} (expected 10)`);
                        }
                    }
                } else {
                    // Check if first byte could be protocol version
                    if (firstByte === 0x0a) {
                        console.log('   ✅ This looks like MySQL protocol (protocol version 10)');
                    } else {
                        // Check if it's a 4-byte length (big-endian) - PostgreSQL style
                        const lengthBE = data.readUInt32BE(0);
                        if (lengthBE > 0 && lengthBE < 10000 && lengthBE === data.length - 4) {
                            console.log('   ⚠️  This might be PostgreSQL (4-byte big-endian length)');
                        } else {
                            console.log('   ⚠️  Unknown protocol format');
                            console.log(`   First 4 bytes: ${Array.from(firstFourBytes).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')}`);
                            console.log(`   Interpreted as 3-byte LE length: ${packetLength}`);
                            console.log(`   Interpreted as 4-byte BE length: ${lengthBE}`);
                            
                            // Check if this is an error response
                            if (data.length === 9 && firstByte === 0x05) {
                                console.log('\n   ⚠️  SUSPICIOUS: 9-byte response starting with 0x05');
                                console.log('   This might be:');
                                console.log('   - A connection rejection/error');
                                console.log('   - A proxy/load balancer response');
                                console.log('   - An incomplete handshake');
                                console.log('   - Wrong service type (not MySQL)');
                            }
                        }
                    }
                }
            }
            
            if (firstByte === 0x45 || firstByte === 0x50) {
                // HTTP responses often start with 'E' (0x45) or 'P' (0x50 for POST/GET)
                const text = data.toString('utf8', 0, Math.min(200, data.length));
                if (text.includes('HTTP')) {
                    console.log('   ⚠️  This appears to be an HTTP response!');
                    console.log(`   Response: ${text.substring(0, 100)}...`);
                }
            }

            // Check if it's a text-based protocol
            const text = data.toString('utf8', 0, Math.min(200, data.length));
            if (text.match(/^[A-Z]+\s+\//)) {
                console.log('   ⚠️  This appears to be an HTTP request/response');
            }

            socket.destroy();
            resolve();
        });

        socket.on('error', (err: Error) => {
            clearTimeout(timer);
            console.log(`❌ Connection error: ${err.message}\n`);
            resolve();
        });

        socket.on('connect', () => {
            console.log('✅ Socket connected, waiting for response...\n');
        });

        socket.connect(parseInt(env.DB_PORT), env.DB_HOST);
    });
}

checkServiceType().then(() => {
    console.log('\n💡 Next Steps:');
    console.log('   1. Verify in Aiven console that the service type is MySQL');
    console.log('   2. Check the connection information page for the correct host/port');
    console.log('   3. Make sure you\'re using the MySQL service, not PostgreSQL or another service');
    console.log('   4. Try using the connection string format from Aiven console\n');
    process.exit(0);
}).catch(console.error);

