import express from 'express';
import { sendMessage, getChatThread,getRequestById } from '../controllers/messageController.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/thread/:requestId', getChatThread);
router.get('/:id', getRequestById);


export default router;
