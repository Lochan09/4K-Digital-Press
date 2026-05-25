import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import contentRouter from './routes/content.js';
import ordersRouter from './routes/orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// API routes
app.use('/api/content', contentRouter);
app.use('/api/orders', ordersRouter);

// Serve the React app for all other GET requests (client-side routing)
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    next();
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
