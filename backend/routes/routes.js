import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/controller.js';
const router = express.Router();

// GET    /tasks        → Retrieve all tasks (sorted by latest first)
router.get('/', getAllTasks);

// POST   /tasks        → Create a new task
router.post('/', createTask);

// PUT    /tasks/:id    → Update a task by ID
router.put('/:id', updateTask);

// DELETE /tasks/:id    → Delete a task by ID
router.delete('/:id', deleteTask);

export default router;