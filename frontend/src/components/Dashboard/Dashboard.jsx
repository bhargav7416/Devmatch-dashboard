import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.developers.total || 0}</h3>
            <p>Total Developers</p>
          </div>
        </div>

        <div className="stat-card available">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats?.developers.available || 0}</h3>
            <p>Available</p>
          </div>
        </div>

        <div className="stat-card on-project">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <h3>{stats?.developers.onProject || 0}</h3>
            <p>On Project</p>
          </div>
        </div>

        <div className="stat-card on-leave">
          <div className="stat-icon">🏖️</div>
          <div className="stat-info">
            <h3>{stats?.developers.onLeave || 0}</h3>
            <p>On Leave</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-info">
            <h3>{stats?.projects.total || 0}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card active-project">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <h3>{stats?.projects.active || 0}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div className="stat-card open-project">
          <div className="stat-icon">🔓</div>
          <div className="stat-info">
            <h3>{stats?.projects.open || 0}</h3>
            <p>Open Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats?.assignments.active || 0}</h3>
            <p>Active Assignments</p>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="recent-section">
        <h2>Recent Assignments</h2>
        {stats?.assignments.recent && stats.assignments.recent.length > 0 ? (
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Developer</th>
                <th>Project</th>
                <th>Client</th>
                <th>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.assignments.recent.map((assignment) => (
                <tr key={assignment._id}>
                  <td>{assignment.developer?.name || 'N/A'}</td>
                  <td>{assignment.project?.projectName || 'N/A'}</td>
                  <td>{assignment.project?.clientName || 'N/A'}</td>
                  <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No recent assignments</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
