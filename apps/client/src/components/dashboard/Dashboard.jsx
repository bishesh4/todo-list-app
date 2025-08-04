import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { taskAPI } from '../../services/api';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskAPI.getAll(),
    select: (data) => data.data.tasks
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['taskStats'],
    queryFn: () => taskAPI.getStats(),
    select: (data) => data.data.stats
  });

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleLogout = () => {
    logout();
  };

  if (tasksLoading || statsLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>TaskManager</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-sidebar">
            <TaskStats stats={statsData} />
            <button 
              onClick={() => setShowTaskForm(true)}
              className="add-task-button"
            >
              + Add New Task
            </button>
          </div>

          <div className="dashboard-main-content">
            {tasksError ? (
              <div className="error-message">
                Failed to load tasks. Please try again.
              </div>
            ) : (
              <TaskList 
                tasks={tasksData || []} 
                onEditTask={handleEditTask}
              />
            )}
          </div>
        </div>
      </main>

      {showTaskForm && (
        <TaskForm 
          task={editingTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default Dashboard; 