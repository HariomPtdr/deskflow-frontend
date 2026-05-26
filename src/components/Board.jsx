import React from 'react';
import TicketColumn from './TicketColumn';

export default function Board({ tickets, onStatusChange, onDelete, failedTransitions }) {
  // Group tickets by status
  const ticketsByStatus = {
    open: tickets.filter(t => t.status === 'open'),
    in_progress: tickets.filter(t => t.status === 'in_progress'),
    resolved: tickets.filter(t => t.status === 'resolved'),
    closed: tickets.filter(t => t.status === 'closed')
  };

  return (
    <div className="board-container">
      <TicketColumn
        title="Open"
        status="open"
        tickets={ticketsByStatus.open}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        failedTransitions={failedTransitions}
      />
      <TicketColumn
        title="In Progress"
        status="in_progress"
        tickets={ticketsByStatus.in_progress}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        failedTransitions={failedTransitions}
      />
      <TicketColumn
        title="Resolved"
        status="resolved"
        tickets={ticketsByStatus.resolved}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        failedTransitions={failedTransitions}
      />
      <TicketColumn
        title="Closed"
        status="closed"
        tickets={ticketsByStatus.closed}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        failedTransitions={failedTransitions}
      />
    </div>
  );
}
