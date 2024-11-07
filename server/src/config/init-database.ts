import { Connection } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const SCHEMA_DIR = path.join(__dirname, '../schema');

async function tableExists(connection: Connection, tableName: string): Promise<boolean> {
  const [rows] = await connection.query(
    'SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?',
    [tableName]
  );
  return (rows as any)[0].count > 0;
}

async function executeSQLFile(connection: Connection, filePath: string): Promise<void> {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = sql
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

  for (const statement of statements) {
    await connection.query(statement);
  }
}

export async function initializeDatabase(connection: Connection): Promise<void> {
  const tables = {
    'hoge_posts': 'posts.sql',
    'hoge_users': 'users.sql',
    'hoge_usermeta': 'usermeta.sql',
    'hoge_postmeta': 'postmeta.sql',
    'hoge_invoices': 'invoices.sql',
    'hoge_tutor_quiz_attempts': 'quiz-attempts.sql',
    'hoge_rm_submissions': 'submissions.sql'
  };

  for (const [tableName, schemaFile] of Object.entries(tables)) {
    const exists = await tableExists(connection, tableName);
    if (!exists) {
      console.log(`Creating table: ${tableName}`);
      await executeSQLFile(connection, path.join(SCHEMA_DIR, schemaFile));
    } else {
      console.log(`Table ${tableName} already exists`);
    }
  }
}