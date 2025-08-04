import express from 'express';
import { db } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';
import { createTaskSchema, updateTaskSchema } from '../validation/schemas.js';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken);

// Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const [tasks] = await db.execute(
      `SELECT id, title, description, due_date, priority, status, created_at, updated_at 
       FROM tasks 
       WHERE user_id = ? 
       ORDER BY 
         CASE 
           WHEN status = 'completed' THEN 3
           WHEN status = 'in_progress' THEN 2
           ELSE 1
         END,
         CASE priority
           WHEN 'high' THEN 1
           WHEN 'medium' THEN 2
           WHEN 'low' THEN 3
         END,
         due_date ASC,
         created_at DESC`,
      [req.user.id]
    );

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
  try {
    const [tasks] = await db.execute(
      'SELECT id, title, description, due_date, priority, status, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: tasks[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const [result] = await db.execute(
      'INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES (?, ?, ?, ?, ?)',
      [
        req.user.id,
        validatedData.title,
        validatedData.description || null,
        validatedData.due_date,
        validatedData.priority
      ]
    );

    const [newTask] = await db.execute(
      'SELECT id, title, description, due_date, priority, status, created_at, updated_at FROM tasks WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask[0]
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);

    // Check if task exists and belongs to user
    const [existingTasks] = await db.execute(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (validatedData.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(validatedData.title);
    }
    if (validatedData.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(validatedData.description);
    }
    if (validatedData.due_date !== undefined) {
      updateFields.push('due_date = ?');
      updateValues.push(validatedData.due_date);
    }
    if (validatedData.priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(validatedData.priority);
    }
    if (validatedData.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(validatedData.status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(req.params.id, req.user.id);

    await db.execute(
      `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      updateValues
    );

    const [updatedTask] = await db.execute(
      'SELECT id, title, description, due_date, priority, status, created_at, updated_at FROM tasks WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Task updated successfully',
      task: updatedTask[0]
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get task statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const [stats] = await db.execute(
      `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgress,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as highPriority,
          SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as mediumPriority,
          SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as lowPriority,
          SUM(CASE WHEN due_date < CURDATE() AND status != 'completed' THEN 1 ELSE 0 END) as overdue
         FROM tasks 
         WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({ stats: stats[0] });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router; 