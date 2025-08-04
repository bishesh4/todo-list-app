import './TaskStats.css';

function TaskStats({ stats }) {
  if (!stats) {
    return (
      <div className="task-stats">
        <h3>Task Statistics</h3>
        <div className="stats-loading">Loading stats...</div>
      </div>
    );
  }

  const totalTasks = stats.total || 0;
  const completedTasks = stats.completed || 0;
  const pendingTasks = stats.pending || 0;
  const inProgressTasks = stats.inProgress || 0;
  const overdueTasks = stats.overdue || 0;
  const highPriorityTasks = stats.highPriority || 0;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="task-stats">
      <h3>Task Overview</h3>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card completed">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card pending">
          <div className="stat-number">{pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-number">{inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Completion Rate</span>
          <span>{completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="priority-section">
        <h4>Priority Breakdown</h4>
        <div className="priority-stats">
          <div className="priority-item high">
            <span className="priority-dot high"></span>
            <span>High: {highPriorityTasks}</span>
          </div>
          <div className="priority-item medium">
            <span className="priority-dot medium"></span>
            <span>Medium: {stats.mediumPriority || 0}</span>
          </div>
          <div className="priority-item low">
            <span className="priority-dot low"></span>
            <span>Low: {stats.lowPriority || 0}</span>
          </div>
        </div>
      </div>

      {overdueTasks > 0 && (
        <div className="overdue-warning">
          <span className="warning-icon">⚠️</span>
          <span>{overdueTasks} task{overdueTasks !== 1 ? 's' : ''} overdue</span>
        </div>
      )}
    </div>
  );
}

export default TaskStats; 