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
  
  // Split SQL statements properly, handling semicolons inside quoted strings
  const statements: string[] = [];
  let currentStatement = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prevChar = i > 0 ? sql[i - 1] : '';
    
    // Handle escape sequences
    if (escaped) {
      currentStatement += char;
      escaped = false;
      continue;
    }
    
    if (char === '\\' && (inSingleQuote || inDoubleQuote)) {
      escaped = true;
      currentStatement += char;
      continue;
    }
    
    // Track quote states
    if (char === "'" && !inDoubleQuote && !escaped) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote && !escaped) {
      inDoubleQuote = !inDoubleQuote;
    }
    
    // Only split on semicolon if we're not inside quotes
    if (char === ';' && !inSingleQuote && !inDoubleQuote) {
      const trimmed = currentStatement.trim();
      if (trimmed.length > 0 && !trimmed.startsWith('--')) {
        statements.push(trimmed);
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Add any remaining statement
  const trimmed = currentStatement.trim();
  if (trimmed.length > 0 && !trimmed.startsWith('--')) {
    statements.push(trimmed);
  }

  for (const statement of statements) {
    // Skip comments and empty statements
    if (statement.trim().length === 0 || statement.trim().startsWith('--')) {
      continue;
    }
    try {
      await connection.query(statement);
    } catch (error: any) {
      // Ignore errors about duplicate keys/indexes (they might already exist)
      if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_DUP_ENTRY' || 
          error.message?.includes('Duplicate key name') ||
          error.message?.includes('already exists')) {
        console.log(`   Warning: ${error.message.split('\n')[0]}`);
        continue;
      }
      // Re-throw other errors
      throw error;
    }
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