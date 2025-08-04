import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../../services/api';
import './TaskForm.css';

function TaskForm({ task, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium'
    });
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: (taskData) => taskAPI.create(taskData),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['taskStats']);
            onClose();
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, taskData }) => taskAPI.update(id, taskData),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['taskStats']);
            onClose();
        }
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
                priority: task.priority || 'medium'
            });
        }
    }, [task]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.title.length > 255) {
            newErrors.title = 'Title must be less than 255 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        if (formData.due_date && new Date(formData.due_date) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.due_date = 'Due date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const taskData = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            due_date: formData.due_date || undefined,
            priority: formData.priority
        };

        if (task) {
            updateTaskMutation.mutate({ id: task.id, taskData });
        } else {
            createTaskMutation.mutate(taskData);
        }
    };

    const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

    return (
        <div className="task-form-overlay" onClick={onClose}>
            <div className="task-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="task-form-header">
                    <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter task description (optional)"
                            rows="3"
                            className={errors.description ? 'error' : ''}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="due_date">Due Date</label>
                            <input
                                type="date"
                                id="due_date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className={errors.due_date ? 'error' : ''}
                            />
                            {errors.due_date && <span className="error-message">{errors.due_date}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (task ? 'Updating...' : 'Creating...')
                                : (task ? 'Update Task' : 'Create Task')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm; 