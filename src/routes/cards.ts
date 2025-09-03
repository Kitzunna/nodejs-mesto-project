import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import {
  validateCreateCard,
  validateCardIdParam,
} from '../middlewares/validators';

const router = Router();

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardIdParam, deleteCard);
router.put('/:cardId/likes', validateCardIdParam, likeCard);
router.delete('/:cardId/likes', validateCardIdParam, dislikeCard);

export default router;
