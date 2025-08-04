import express from 'express';
import { hash, verify } from '@node-rs/bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../index.js';
import { registerSchema, loginSchema } from '../validation/schemas.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [validatedData.email, validatedData.username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        // Hash password
        const passwordHash = await hash(validatedData.password, 12);

        // Insert new user
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [validatedData.username, validatedData.email, passwordHash]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertId, email: validatedData.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                username: validatedData.username,
                email: validatedData.email
            }
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        // Find user by email
        const [users] = await db.execute(
            'SELECT id, username, email, password_hash FROM users WHERE email = ?',
            [validatedData.email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await verify(validatedData.password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user profile
router.get('/profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        const [users] = await db.execute(
            'SELECT id, username, email, created_at FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Invalid token' });
        }
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

export default router; 