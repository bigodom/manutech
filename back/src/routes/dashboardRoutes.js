import express from 'express';
import { getDashboardStats, getFlowData } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/flow', getFlowData);

export default router; 