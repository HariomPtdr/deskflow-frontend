import React from 'react';

export default function FilterBar({ filters, onFilterChange }) {
  const handlePriorityChange = (e) => {
    onFilterChange({
      ...filters,
      priority: e.target.value
    });
  };

  const handleBreachedToggle = (e) => {
    onFilterChange({
      ...filters,
      breached: e.target.checked
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      priority: '',
      breached: false
    });
  };

  const hasActiveFilters = filters.priority !== '' || filters.breached === true;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="priority-select" className="filter-label">Priority</label>
        <select
          id="priority-select"
          className="filter-select"
          value={filters.priority || ''}
          onChange={handlePriorityChange}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="filter-group checkbox-group">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={filters.breached || false}
            onChange={handleBreachedToggle}
          />
          <span className="checkbox-checkmark"></span>
          SLA Breached Only
        </label>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="btn-clear-filters"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
