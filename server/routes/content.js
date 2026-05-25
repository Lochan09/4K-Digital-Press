import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    stats: [
      { value: '72+', label: '4K Designs' },
      { value: '12+', label: 'Combo Types' },
      { value: '100%', label: 'Custom Made' },
    ],
  });
});

export default router;
