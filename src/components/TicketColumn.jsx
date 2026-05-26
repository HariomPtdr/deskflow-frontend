import React, { useState } from 'react';
import TicketCard from './TicketCard';

export default function TicketColumn({
  title,
  status,
  tickets,
  onStatusChange,
  onDelete,
  failedTransitions
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const ticketId = e.dataTransfer.getData('text/plain');
    const sourceStatus = e.dataTransfer.getData('source-status');
    
    if (ticketId && sourceStatus !== status) {
      onStatusChange(ticketId, status);
    }
  };

  return (
    <div
      className={`ticket-column status-${status} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="column-badge">{tickets.length}</span>
      </div>

      <div className="column-cards-container">
        {tickets.length === 0 ? (
          <div className="empty-column-placeholder">
            No tickets here
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              transitionError={failedTransitions ? failedTransitions[ticket._id] : null}
            />
          ))
        )}
      </div>
    </div>
  );
}
