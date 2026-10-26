import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schema.js';
import {
  createTaskCtrl,
  listTasksCtrl,
  getTaskCtrl,
  updateTaskCtrl,
  deleteTaskCtrl,
} from './tasks.controller.js';

const router = Router();

router.get('/', listTasksCtrl);
router.get('/:id', getTaskCtrl);
router.post('/', validate(createTaskSchema), createTaskCtrl);
router.patch('/:id', validate(updateTaskSchema), updateTaskCtrl);
router.delete('/:id', deleteTaskCtrl);

export default router;
