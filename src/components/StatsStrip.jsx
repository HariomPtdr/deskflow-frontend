import React from 'react';

export default function StatsStrip({ stats }) {
  const byStatus = stats?.byStatus || { open: 0, in_progress: 0, resolved: 0, closed: 0 };
  const slaBreachedOpen = stats?.slaBreachedOpen || 0;

  return (
    <div className="stats-strip">
      <div className="stat-card stat-open">
        <span className="stat-indicator"></span>
        <span className="stat-label">Open</span>
        <span className="stat-value">{byStatus.open}</span>
      </div>
      
      <div className="stat-card stat-in-progress">
        <span className="stat-indicator"></span>
        <span className="stat-label">In Progress</span>
        <span className="stat-value">{byStatus.in_progress}</span>
      </div>
      
      <div className="stat-card stat-resolved">
        <span className="stat-indicator"></span>
        <span className="stat-label">Resolved</span>
        <span className="stat-value">{byStatus.resolved}</span>
      </div>
      
      <div className="stat-card stat-closed">
        <span className="stat-indicator"></span>
        <span className="stat-label">Closed</span>
        <span className="stat-value">{byStatus.closed}</span>
      </div>
      
      <div className={`stat-card stat-breached ${slaBreachedOpen > 0 ? 'pulse' : ''}`}>
        <span className="stat-indicator"></span>
        <span className="stat-label">SLA Breached (Open)</span>
        <span className="stat-value">{slaBreachedOpen}</span>
      </div>
    </div>
  );
}
