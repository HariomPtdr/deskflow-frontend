import React, { useState } from 'react';
import { formatAge } from '../utils/formatAge';

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

export default function TicketCard({ ticket, onStatusChange, onDelete, transitionError }) {
  const [isUpdating, setIsUpdating] = useState(null); // stores the target status when in-flight
  const [isDeleting, setIsDeleting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localFlash, setLocalFlash] = useState(false);

  // Compute allowed transitions
  const getAllowedTransitions = (status) => {
    switch (status) {
      case 'open':
        return { prev: null, next: 'in_progress' };
      case 'in_progress':
        return { prev: 'open', next: 'resolved' };
      case 'resolved':
        return { prev: 'in_progress', next: 'closed' };
      case 'closed':
        return { prev: 'resolved', next: null };
      default:
        return { prev: null, next: null };
    }
  };

  const { prev, next } = getAllowedTransitions(ticket.status);

  const handleTransition = async (targetStatus) => {
    if (!targetStatus) return;
    setIsUpdating(targetStatus);
    setLocalError(null);
    try {
      await onStatusChange(ticket._id, targetStatus);
    } catch (err) {
      setLocalError(err.message || 'Transition failed');
      setLocalFlash(true);
      setTimeout(() => setLocalFlash(false), 2000);
      setTimeout(() => setLocalError(null), 4000);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this ticket?\n"${ticket.subject}"`)) {
      setIsDeleting(true);
      try {
        await onDelete(ticket._id);
      } catch (err) {
        setLocalError(err.message || 'Delete failed');
        setLocalFlash(true);
        setTimeout(() => setLocalFlash(false), 2000);
        setIsDeleting(false);
      }
    }
  };

  // Drag start handler for native HTML5 drag-and-drop
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', ticket._id);
    e.dataTransfer.setData('source-status', ticket.status);
    e.dataTransfer.effectAllowed = 'move';
    // Add dragging styling class shortly so card remains visible while dragging
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  // Combine parent transition errors (from drag/drop) and local button errors
  const activeError = transitionError || localError;
  const isFlashing = localFlash || !!transitionError;

  return (
    <div
      className={`ticket-card priority-${ticket.priority} ${isFlashing ? 'flash-red' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      id={`ticket-${ticket._id}`}
    >
      <div className="card-header">
        <span className={`priority-badge priority-${ticket.priority}`}>
          {ticket.priority}
        </span>
        <button
          type="button"
          className="btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete Ticket"
        >
          {isDeleting ? '...' : '✕'}
        </button>
      </div>

      <h4 className="ticket-subject">{ticket.subject}</h4>
      <p className="ticket-description">{ticket.description}</p>
      
      <div className="ticket-meta">
        <span className="customer-email" title={ticket.customerEmail}>
          {ticket.customerEmail}
        </span>
        <div className="meta-row">
          <span className="ticket-age">⏳ {formatAge(ticket.ageMinutes)}</span>
          {ticket.slaBreached && (
            <span className="sla-badge">⚠ SLA Breached</span>
          )}
        </div>
      </div>

      {activeError && (
        <div className="card-error-msg">
          {activeError}
        </div>
      )}

      <div className="card-actions">
        {prev ? (
          <button
            type="button"
            className="btn-transition btn-prev"
            onClick={() => handleTransition(prev)}
            disabled={isUpdating !== null || isDeleting}
          >
            {isUpdating === prev ? (
              <span className="spinner-mini"></span>
            ) : (
              `← ${STATUS_LABELS[prev]}`
            )}
          </button>
        ) : (
          <div className="action-placeholder"></div>
        )}

        {next ? (
          <button
            type="button"
            className="btn-transition btn-next"
            onClick={() => handleTransition(next)}
            disabled={isUpdating !== null || isDeleting}
          >
            {isUpdating === next ? (
              <span className="spinner-mini"></span>
            ) : (
              `→ ${STATUS_LABELS[next]}`
            )}
          </button>
        ) : (
          <div className="action-placeholder"></div>
        )}
      </div>
    </div>
  );
}
