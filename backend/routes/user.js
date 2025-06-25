import express from 'express'
import {completeUserProfile,getExploreMentors,getUser,getUserProfile,getUsersWhoCanTeach} from '../controllers/user_controller.js'

const router=express.Router();

router.post('/addInfo',completeUserProfile);
router.get('/getUserInfo/:identifier',getUserProfile);
router.get('/explore/:userId',getExploreMentors);
router.get('/getMentor/:id', getUser);


export default router;