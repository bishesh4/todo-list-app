# TaskManager - Full-Stack Task Management Application

A modern, full-stack task management application built as an MVP for university coursework. TaskManager provides secure user authentication, comprehensive task management, and a beautiful, responsive user interface.

## 🚀 Features

### User Authentication

- Secure user registration and login
- JWT-based authentication with token expiration
- Password hashing using bcrypt
- Protected routes and session management

### Task Management

- Create, read, update, and delete tasks
- Task prioritization (low, medium, high)
- Task status tracking (pending, in progress, completed)
- Due date management with overdue detection
- Task filtering and sorting
- Rich task descriptions

### User Interface

- Modern, responsive design
- Real-time data synchronization
- Intuitive task organization
- Visual progress tracking
- Mobile-first approach

### Security & Performance

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- Optimized database queries
- Connection pooling

## 🛠️ Technology Stack

### Frontend

- **React 19**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **TanStack Query**: Server state management and caching
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **CSS3**: Modern styling with responsive design

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MySQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **Zod**: Schema validation
- **bcrypt**: Password hashing
- **Helmet**: Security middleware

### Database

- **MySQL 8.0+**: Primary database
- **Proper normalization**: Optimized schema design
- **Indexing**: Performance optimization
- **Foreign key constraints**: Data integrity

## 📁 Project Structure

```
todo-list/
├── apps/
│   ├── client/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/      # Authentication components
│   │   │   │   └── dashboard/ # Task management components
│   │   │   ├── contexts/      # React contexts
│   │   │   ├── services/      # API services
│   │   │   └── ...
│   │   └── package.json
│   └── server/                 # Node.js backend
│       ├── src/
│       │   ├── database/      # Database initialization
│       │   ├── middleware/    # Express middleware
│       │   ├── routes/        # API routes
│       │   ├── validation/    # Zod schemas
│       │   └── index.js       # Server entry point
│       └── package.json
├── package.json               # Workspace configuration
└── README.md
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_due_date (due_date)
);
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd todo-list
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```sql
CREATE DATABASE taskmanager;
```

4. **Configure environment variables**

Create `.env` file in `apps/server/`:

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

Create `.env` file in `apps/client/`:

```env
VITE_API_URL=http://localhost:3001/api
```

5. **Start the development servers**

Terminal 1 (Backend):

```bash
cd apps/server
npm run dev
```

Terminal 2 (Frontend):

```bash
cd apps/client
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## 🔐 Security Measures

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with cost factor 12
- **Token Expiration**: 7-day token lifetime
- **Session Validation**: Database verification on each request

### Input Validation

- **Zod Schemas**: Comprehensive validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Rate Limiting**: 100 requests per 15 minutes per IP

### Data Protection

- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: Helmet.js implementation
- **Environment Variables**: Secure configuration management
- **Database Isolation**: User data separation

## 📊 API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### POST /api/auth/login

Authenticate user and receive JWT token

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### GET /api/auth/profile

Get current user profile (requires authentication)

### Task Management Endpoints

#### GET /api/tasks

Retrieve all tasks for authenticated user

#### POST /api/tasks

Create a new task

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the TaskManager project",
  "due_date": "2024-01-15",
  "priority": "high"
}
```

#### PUT /api/tasks/:id

Update an existing task

```json
{
  "status": "in_progress",
  "priority": "medium"
}
```

#### DELETE /api/tasks/:id

Delete a task

#### GET /api/tasks/stats/summary

Get task statistics and progress overview

## 🎨 Frontend Architecture

### Component Structure

- **Authentication Components**: Login, Register forms
- **Dashboard Components**: Task list, statistics, forms
- **Context Providers**: Global state management
- **Service Layer**: API communication and caching

### State Management

- **React Context**: Authentication state
- **TanStack Query**: Server state and caching
- **Local State**: Component-specific state

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: Desktop (1200px+), Tablet (768px-1199px), Mobile (320px-767px)
- **Flexible Layout**: CSS Grid and Flexbox

## 🔧 Development

### Code Quality

- **ESLint**: Code linting and formatting
- **Modular Architecture**: Separation of concerns
- **Type Safety**: Strong typing practices
- **Error Handling**: Comprehensive error management

### Performance Optimizations

- **Code Splitting**: React Router lazy loading
- **Query Caching**: TanStack Query optimization
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Database performance

## 🧪 Testing Strategy

### Frontend Testing

- Component testing with React Testing Library
- Integration testing for user workflows
- E2E testing for critical paths

### Backend Testing

- Unit testing for business logic
- Integration testing for API endpoints
- Database testing for data integrity

## 📈 Future Improvements

### Planned Features

- **Real-time Collaboration**: Multi-user task sharing
- **File Attachments**: Task file uploads
- **Email Notifications**: Due date reminders
- **Advanced Analytics**: Detailed progress reports
- **Mobile App**: Native mobile application

### Technical Enhancements

- **TypeScript Migration**: Enhanced type safety
- **GraphQL API**: More efficient data fetching
- **Microservices**: Scalable architecture
- **Docker Deployment**: Containerized application
- **CI/CD Pipeline**: Automated testing and deployment

## 📝 Documentation Guidelines

This project follows comprehensive documentation standards:

### Project Overview

TaskManager is a full-stack web application designed for personal task management with user authentication and data persistence. The application provides an intuitive interface for creating, organizing, and tracking tasks with priority levels and due dates.

### Technology Stack

The application uses modern web technologies including React for the frontend, Node.js/Express for the backend, and MySQL for data persistence. The tech stack was chosen for its reliability, performance, and developer experience.

### Architecture Design

- **Frontend**: React-based SPA with component-based architecture
- **Backend**: RESTful API with Express.js and middleware pattern
- **Database**: Normalized MySQL schema with proper indexing
- **Authentication**: JWT-based stateless authentication

### Security Implementation

- Input validation using Zod schemas
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- Rate limiting and CORS configuration

### Challenges and Solutions

- **State Management**: Implemented TanStack Query for efficient server state management
- **Real-time Updates**: Used optimistic updates for better UX
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Performance**: Database indexing and connection pooling

## 📄 License

This project is developed for educational purposes as part of university coursework.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add comprehensive tests
5. Update documentation
6. Submit a pull request

---

**TaskManager** - Empowering productivity through intelligent task management.
