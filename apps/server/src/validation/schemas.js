import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  due_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional()
    .transform(val => val ? new Date(val) : null),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
});

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  due_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional()
    .transform(val => val ? new Date(val) : null),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional()
}); 