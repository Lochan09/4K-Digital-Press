import { Router } from 'express';
import upload from '../middleware/upload.js';

const router = Router();

// In-memory store (replace with a database for production)
let orders = [];

router.post('/', upload.array('photos', 12), (req, res) => {
  const data = req.body;
  const files = req.files || [];

  const order = {
    id: orders.length + 1,
    data,
    files: files.map((f) => ({ originalname: f.originalname, path: f.path })),
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  res.status(201).json({ ok: true, orderId: order.id });
});

router.get('/', (req, res) => {
  res.json(orders.slice().reverse());
});

export default router;
