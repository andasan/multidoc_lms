import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDatabaseConnection, initDb } from '../src/config/database';
import userRoutes from '../src/routes/user.routes';
import invoiceRoutes from '../src/routes/invoice.route';

dotenv.config();

const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';
const DEV_ORIGINS = process.env.DEV_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);
const PROD_ORIGINS = process.env.PROD_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);

const allowedOrigins = isDevelopment ? DEV_ORIGINS : PROD_ORIGINS;

app.use(cors({
    origin: allowedOrigins?.length ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({ message: 'Hello, Vercel!' });
});

// Mount under /api/* (full URL) and /* (Vercel catch-all may strip /api)
app.use(['/api/users', '/users'], userRoutes);
app.use(['/api/invoices', '/invoices'], invoiceRoutes);

app.get(['/api/health', '/health'], (_req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});
export default app;

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await testDatabaseConnection();
        await initDb();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Local/dev only — Vercel invokes the exported app as a serverless function
if (!process.env.VERCEL) {
    startServer();
}
