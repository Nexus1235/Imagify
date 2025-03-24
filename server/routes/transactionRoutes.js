import express from 'express';
import { exportTransactionHistory } from '../controllers/transactionController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

// Route to export transaction history as a PDF
router.get('/export', authUser, exportTransactionHistory);

export default router;
