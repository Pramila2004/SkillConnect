import express from 'express';
import { addReview, getReviewsForMentor } from '../controllers/review_controller.js';

const router = express.Router();

router.post('/add', addReview);
router.get('/:id', getReviewsForMentor);

export default router;