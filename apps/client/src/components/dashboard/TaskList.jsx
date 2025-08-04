import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../../services/api';
import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, onEditTask }) {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('priority');
    const queryClient = useQueryClient();

    const deleteTaskMutation = useMutation({
        mutationFn: (taskId) => taskAPI.delete(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['taskStats']);
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, taskData }) => taskAPI.update(id, taskData),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['taskStats']);
        }
    });

    const handleDeleteTask = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTaskMutation.mutate(taskId);
        }
    };

    const handleStatusChange = (taskId, newStatus) => {
        updateTaskMutation.mutate({ id: taskId, taskData: { status: newStatus } });
    };

    const filteredTasks = tasks.filter(task => {
        switch (filter) {
            case 'pending':
                return task.status === 'pending';
            case 'in_progress':
                return task.status === 'in_progress';
            case 'completed':
                return task.status === 'completed';
            case 'overdue':
                return task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
            default:
                return true;
        }
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'due_date':
                if (!a.due_date && !b.due_date) return 0;
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(a.due_date) - new Date(b.due_date);
            case 'created_at':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h2>My Tasks</h2>
                <div className="task-controls">
                    <div className="filter-controls">
                        <label htmlFor="filter">Filter:</label>
                        <select
                            id="filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    <div className="sort-controls">
                        <label htmlFor="sort">Sort by:</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="priority">Priority</option>
                            <option value="due_date">Due Date</option>
                            <option value="created_at">Created Date</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="task-list-content">
                {sortedTasks.length === 0 ? (
                    <div className="empty-state">
                        <p>No tasks found. Create your first task to get started!</p>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {sortedTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onEdit={() => onEditTask(task)}
                                onDelete={() => handleDeleteTask(task.id)}
                                onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                                isUpdating={updateTaskMutation.isPending}
                            />
                        ))}
                    </div>
                )}
            </div>

            {deleteTaskMutation.isPending && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Deleting task...</div>
                </div>
            )}
        </div>
    );
}

export default TaskList; 