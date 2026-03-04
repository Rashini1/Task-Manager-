const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * GET /tasks
 * Fetch all tasks sorted by latest first
 */
const getAllTasks = async () => {
  const response = await fetch(`${API_BASE}/api/tasks`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch tasks');
  }

  return data;
};

/**
 * POST /tasks
 * Create a new task
 * @param {{ title: string, description?: string, status?: string }} taskData
 */
const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to create task');
  }

  return data;
};

/**
 * PUT /tasks/:id
 * Update an existing task by ID
 * @param {string} id - Task ID
 * @param {{ title?: string, description?: string, status?: string }} updates
 */
const updateTask = async (id, updates) => {
  const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to update task');
  }

  return data;
};

/**
 * DELETE /tasks/:id
 * Delete a task by ID
 * @param {string} id - Task ID
 */
const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to delete task');
  }

  return data;
};

/**
 * Toggle task status between Pending and Completed
 * @param {{ _id: string, status: string }} task
 */
const toggleTaskStatus = async (task) => {
  const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
  return await updateTask(task._id, { status: newStatus });
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask, toggleTaskStatus };