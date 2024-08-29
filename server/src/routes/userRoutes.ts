import express from 'express';
import {
  createUser,
  getAllUsers,
  getSessionUser,
  loginUser,
  logoutUser,
  getUserById,
  getUnreadMessages,
  markAsRead,
} from '../controller/userController';
import ValidateAuth from '../middlewares/auth/validateAuth';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', ValidateAuth, logoutUser);
router.get('/user/:userId', getUserById);
router.get('/session', getSessionUser, ValidateAuth);
router.get('/users', getAllUsers, ValidateAuth);
router.get('/unread-messages', getUnreadMessages, ValidateAuth);
router.post('/mark-messages-read', markAsRead, ValidateAuth);

export default router;
