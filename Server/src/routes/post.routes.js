import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.post('/', authenticate, authorize(['admin']), postController.create);
router.put('/:id', authenticate, authorize(['admin']), postController.update);
router.delete('/:id', authenticate, authorize(['admin']), postController.remove);

export default router;
