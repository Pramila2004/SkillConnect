import express from 'express';
import {
  getAllUsers,
  deleteUser,
  editUser,
  getUserDetails,
  searchUsers,
  getAllRequests,
  getStats,
} from '../controllers/admin_controller.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);
router.put('/user/:id', editUser);
router.get('/user/:id', getUserDetails);
router.get('/users/search', searchUsers);
router.get('/requests', getAllRequests);
router.get('/stats', getStats);

export default router;