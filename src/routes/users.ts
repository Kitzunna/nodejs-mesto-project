import { Router } from 'express';
import {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} from '../controllers/users';
import {
  validateUserIdParam,
  validateUpdateProfile,
  validateUpdateAvatar,
} from '../middlewares/validators';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserIdParam, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
