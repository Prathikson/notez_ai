import express from 'express';
import cors from 'cors';
import path from 'path';
import uploadRouter from './routes/upload';

const app = express();

app.get('/', (req, res) => {
  res.send('Server is up and running! 😎');
});
// Serve the 'uploads' folder as a static directory
// Make sure the 'uploads' folder is in the root directory of the project (same level as 'src' folder)
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or set to 'http://localhost:5173'
  next();
}, express.static(path.join(__dirname, '..', 'uploads')));
// Enable CORS for all routes
app.use(cors({
  origin: 'https://notez-ai-frontend.vercel.app', // Allow requests from the frontend
  methods: ['GET', 'POST'],       // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
}));

app.use('/upload', uploadRouter);  // Your upload route

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
