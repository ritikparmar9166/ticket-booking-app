import { Router } from 'express';
import { getAllSeats, handleReservation, resetSeats } from '../functions/reservation.js';
import { authenticateToken } from '../middleware/authmiddleware.js';

const router = Router();

router.post('/reserve', authenticateToken, handleReservation);
router.get('/get-all-seats', authenticateToken, getAllSeats);
router.get('/reset-seats', authenticateToken, resetSeats);

export default router;