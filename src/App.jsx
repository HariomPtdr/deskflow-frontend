import React, { useState } from 'react';
import useTickets from './hooks/useTickets';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import Board from './components/Board';
import CreateTicketModal from './components/CreateTicketModal';

export default function App() {
  const {
    tickets,
    stats,
    filters,
    setFilters,
    loading,
    error,
    failedTransitions,
    handleStatusChange,
    handleDelete,
    handleCreated,
    handleRetry
  } = useTickets();

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app-container">
      {/* Premium Glassmorphic Header */}
      <header className="app-header">
        <div className="header-logo-container">
          <span className="logo-icon">⚡</span>
          <h1 className="app-title">DeskFlow</h1>
        </div>
        <button
          type="button"
          className="btn-new-ticket"
          onClick={() => setShowModal(true)}
        >
          <span className="btn-icon">+</span> New Ticket
        </button>
      </header>

      <main className="app-main">
        {error ? (
          <div className="error-banner-container">
            <div className="error-banner">
              <span className="error-icon">❌</span>
              <div className="error-details">
                <h3>Connection Error</h3>
                <p>{error}</p>
              </div>
              <button
                type="button"
                className="btn-retry"
                onClick={handleRetry}
              >
                🔄 Retry Connection
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p className="loading-text">Loading DeskFlow Board...</p>
          </div>
        ) : (
          <>
            {/* StatsStrip displays status counts and SLA breach count */}
            <StatsStrip stats={stats} />

            {/* FilterBar houses search dropdowns and checkbox toggles */}
            <FilterBar filters={filters} onFilterChange={setFilters} />

            {/* Board displays columns with tickets and native Drag and Drop support */}
            <Board
              tickets={tickets}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              failedTransitions={failedTransitions}
            />
          </>
        )}
      </main>

      {/* Modal for creating a new ticket */}
      {showModal && (
        <CreateTicketModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      <footer className="app-footer">
        <p>DeskFlow Support Triage Board &copy; {new Date().getFullYear()} — Powered by MERN</p>
      </footer>
    </div>
  );
}
