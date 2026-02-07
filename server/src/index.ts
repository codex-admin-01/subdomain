import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', router);
app.use(errorHandler);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API running on ${port}`));
