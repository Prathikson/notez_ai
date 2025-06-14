import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';

dotenv.config();

const app = express();

// Load FRONTEND_URL from .env or fallback
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Enable CORS globally
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (req, res) => {
  res.send('Server is up and running! 😎');
});

// Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Upload route
app.use('/upload', uploadRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
