import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_PORT',
  'DB_PREFIX',
  'DB_CA_CERT'
] as const;

function checkEnvVariables(): void {
  const missingVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  console.log('✅ Environment variables validated successfully');
}

export const env = {
  DB_HOST: process.env.DB_HOST as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_PORT: process.env.DB_PORT as string,
  DB_PREFIX: process.env.DB_PREFIX as string,
  DB_CA_CERT: process.env.DB_CA_CERT as string,
} as const;

checkEnvVariables();

export default env;