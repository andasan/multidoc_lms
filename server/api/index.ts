console.log('Server is running');
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDatabaseConnection, initDb } from '../src/config/database';
import userRoutes from '../src/routes/user.routes';
import invoiceRoutes from '../src/routes/invoice.route';
dotenv.config();

const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';
const DEV_ORIGINS = process.env.DEV_ORIGINS?.split(',');
const PROD_ORIGINS = process.env.PROD_ORIGINS?.split(',');

const allowedOrigins = isDevelopment 
    ? DEV_ORIGINS
    : PROD_ORIGINS;

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: "Hello, Vercel!" });
});

app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});

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

startServer();
