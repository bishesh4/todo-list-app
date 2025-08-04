# TaskManager Server

A robust Node.js/Express backend for the TaskManager application, providing secure authentication, task management, and data persistence with MySQL.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Task Management**: Full CRUD operations for tasks with user isolation
- **Data Validation**: Comprehensive input validation using Zod schemas
- **Security**: Rate limiting, CORS protection, and input sanitization
- **Database**: MySQL with proper normalization and indexing
- **Error Handling**: Comprehensive error management and logging
- **API Documentation**: RESTful API with clear endpoints

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MySQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **Zod**: Schema validation
- **bcrypt**: Password hashing
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing

## Project Structure

```
src/
├── database/
│   └── init.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── validation/
│   └── schemas.js
└── index.js
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### Authentication

#### POST /api/auth/register

Register a new user

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### POST /api/auth/login

Login user

```json
{
  "email": "string",
  "password": "string"
}
```

#### GET /api/auth/profile

Get current user profile (requires authentication)

### Tasks

#### GET /api/tasks

Get all tasks for authenticated user

#### GET /api/tasks/:id

Get specific task by ID

#### POST /api/tasks

Create new task

```json
{
  "title": "string",
  "description": "string (optional)",
  "due_date": "YYYY-MM-DD (optional)",
  "priority": "low|medium|high"
}
```

#### PUT /api/tasks/:id

Update task

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "due_date": "YYYY-MM-DD (optional)",
  "priority": "low|medium|high (optional)",
  "status": "pending|in_progress|completed (optional)"
}
```

#### DELETE /api/tasks/:id

Delete task

#### GET /api/tasks/stats/summary

Get task statistics for authenticated user

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp env.example .env
```

3. Configure the `.env` file:

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:5173
```

4. Create MySQL database:

```sql
CREATE DATABASE taskmanager;
```

### Development

Start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3001`

### Production

Start the production server:

```bash
npm start
```

## Security Features

### Authentication & Authorization

- JWT token-based authentication
- Secure password hashing with bcrypt
- Token expiration and validation
- User session management

### Input Validation

- Zod schema validation for all inputs
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- Rate limiting to prevent abuse

### Data Protection

- CORS configuration for cross-origin requests
- Helmet.js for security headers
- Environment variable management
- Database connection pooling

## Validation Rules

### User Registration

- Username: 3-50 characters, alphanumeric + underscore
- Email: Valid email format, max 100 characters
- Password: 8+ characters, must contain lowercase, uppercase, and number

### Task Creation/Update

- Title: 1-255 characters, required
- Description: Max 1000 characters, optional
- Due Date: YYYY-MM-DD format, optional, cannot be in past
- Priority: low, medium, or high
- Status: pending, in_progress, or completed

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

Common HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Database Optimization

- Proper indexing on frequently queried columns
- Foreign key constraints for data integrity
- Connection pooling for better performance
- Optimized queries with proper joins

## Monitoring & Logging

- Request/response logging
- Error tracking and reporting
- Database query monitoring
- Performance metrics

## Testing

Run tests (when implemented):

```bash
npm test
```

## Deployment

### Environment Variables

Ensure all required environment variables are set in production:

- Database credentials
- JWT secret
- CORS origins
- Port configuration

### Database Migration

The database schema is automatically created on server startup.

### Health Check

Monitor server health at: `GET /api/health`

## Contributing

1. Follow the existing code style and patterns
2. Add proper error handling for new endpoints
3. Include input validation for all new routes
4. Update API documentation
5. Test thoroughly before submitting

## License

This project is part of the TaskManager application and follows the same license terms.
