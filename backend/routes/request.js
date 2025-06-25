import express from 'express';
import {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus
} from '../controllers/request_controller.js';

const router = express.Router();

router.post('/send', sendRequest);
router.get('/received/:userId', getReceivedRequests);
router.get('/sent/:userId', getSentRequests);
router.patch('/update/:requestId', updateRequestStatus);

export default router;
