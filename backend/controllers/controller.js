import mongoose from 'mongoose';
import Task from '../models/model.js';

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * GET /tasks
 * Retrieve all tasks sorted by latest created first
 */
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
      error: err.message,
    });
  }
};

/**
 * POST /tasks
 * Create a new task
 * Body: { title, description?, status? }
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const task = await Task.create({ title, description, status });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating task',
      error: err.message,
    });
  }
};

/**
 * PUT /tasks/:id
 * Update an existing task by ID
 * Body: { title?, description?, status? }
 */
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty',
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating task',
      error: err.message,
    });
  }
};

/**
 * DELETE /tasks/:id
 * Delete a task by ID
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
      error: err.message,
    });
  }
};

export { getAllTasks, createTask, updateTask, deleteTask };