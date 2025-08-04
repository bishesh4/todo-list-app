# TaskManager Client

A modern React-based frontend for the TaskManager application, providing an intuitive and responsive user interface for task management.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Organization**: Filter and sort tasks by status, priority, and due date
- **Real-time Updates**: Automatic data synchronization using TanStack Query
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Task Statistics**: Visual overview of task completion and priority breakdown
- **Form Validation**: Client-side validation with error handling

## Tech Stack

- **React 19**: Latest React with modern hooks and features
- **Vite**: Fast build tool and development server
- **TanStack Query**: Server state management and caching
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **CSS3**: Modern styling with responsive design

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Auth.css
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── TaskList.jsx
│       ├── TaskItem.jsx
│       ├── TaskForm.jsx
│       ├── TaskStats.jsx
│       └── *.css
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TaskManager server running on port 3001

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Configure environment variables:

```env
VITE_API_URL=http://localhost:3001/api
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Key Components

### Authentication

- **Login/Register**: Secure user authentication with form validation
- **AuthContext**: Global state management for user authentication
- **Protected Routes**: Automatic redirection for unauthenticated users

### Dashboard

- **Task Overview**: Statistics and progress tracking
- **Task List**: Filterable and sortable task display
- **Task Cards**: Individual task management with status updates
- **Task Form**: Modal-based task creation and editing

### API Integration

- **Axios Configuration**: Centralized API client with interceptors
- **TanStack Query**: Efficient data fetching and caching
- **Error Handling**: Comprehensive error management and user feedback

## Security Features

- JWT token-based authentication
- Automatic token refresh and logout on expiration
- Input sanitization and validation
- Secure password requirements
- CORS protection

## Responsive Design

The application is fully responsive and optimized for:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Performance Optimizations

- Code splitting with React Router
- Efficient re-rendering with React hooks
- Optimistic updates for better UX
- Lazy loading of components
- CSS-in-JS for better performance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style and patterns
2. Ensure all tests pass
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is part of the TaskManager application and follows the same license terms.
