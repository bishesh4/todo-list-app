import './TaskItem.css';

function TaskItem({ task, onEdit, onDelete, onStatusChange, isUpdating }) {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return '#ef4444';
            case 'medium':
                return '#f59e0b';
            case 'low':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#10b981';
            case 'in_progress':
                return '#3b82f6';
            case 'pending':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysUntilDue = (dateString) => {
        if (!dateString) return null;
        const dueDate = new Date(dateString);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due in ${diffDays} days`;
    };

    return (
        <div className={`task-item ${task.status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
            <div className="task-header">
                <div className="task-priority">
                    <span
                        className="priority-indicator"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                    />
                    <span className="priority-text">{task.priority}</span>
                </div>

                <div className="task-actions">
                    <button
                        onClick={onEdit}
                        className="action-button edit-button"
                        title="Edit task"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={onDelete}
                        className="action-button delete-button"
                        title="Delete task"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className="task-content">
                <h3 className="task-title">{task.title}</h3>

                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}

                {task.due_date && (
                    <div className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                        📅 {formatDate(task.due_date)}
                        <span className="due-info">{getDaysUntilDue(task.due_date)}</span>
                    </div>
                )}
            </div>

            <div className="task-footer">
                <div className="task-status">
                    <select
                        value={task.status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        disabled={isUpdating}
                        className="status-select"
                        style={{ borderColor: getStatusColor(task.status) }}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="task-meta">
                    <span className="task-date">
                        Created: {formatDate(task.created_at)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TaskItem; 