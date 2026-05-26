import { useState, useEffect, useCallback } from 'react';
import { fetchTickets, fetchStats, updateTicketStatus, deleteTicket } from '../utils/api';

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    byStatus: { open: 0, in_progress: 0, resolved: 0, closed: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    slaBreachedOpen: 0
  });
  const [filters, setFilters] = useState({ priority: '', breached: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track failed transitions per ticket to show card-specific visual rollback alerts
  const [failedTransitions, setFailedTransitions] = useState({});

  /**
   * Fetches tickets with the active filters and stats concurrently.
   */
  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const [ticketsData, statsData] = await Promise.all([
        fetchTickets(filters),
        fetchStats()
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching DeskFlow data:', err);
      setError(err.message || 'Failed to fetch data from the server.');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [filters]);

  // Load tickets only when filters change (without full loading state spinner for seamless feel)
  useEffect(() => {
    let isMounted = true;
    
    async function loadTicketsFiltered() {
      try {
        const ticketsData = await fetchTickets(filters);
        if (isMounted) {
          setTickets(ticketsData);
        }
      } catch (err) {
        console.error('Error filtering tickets:', err);
        if (isMounted) {
          setError(err.message || 'Failed to filter tickets.');
        }
      }
    }

    // On mount, the main loadData runs. For subsequent changes, run just the tickets load.
    if (!loading) {
      loadTicketsFiltered();
    }
    
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Initial load
  useEffect(() => {
    loadData(true);
  }, []);

  /**
   * Handles status updates (transition buttons or drag-drop).
   */
  const handleStatusChange = async (ticketId, targetStatus) => {
    // Clear any previous error for this card
    setFailedTransitions(prev => {
      const updated = { ...prev };
      delete updated[ticketId];
      return updated;
    });

    try {
      // Call api and wait
      const updatedTicket = await updateTicketStatus(ticketId, targetStatus);
      
      // Update local ticket list
      setTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t));
      
      // Refetch stats silently to maintain sync
      const updatedStats = await fetchStats();
      setStats(updatedStats);
    } catch (err) {
      console.error(`Transition failed for ticket ${ticketId}:`, err);
      
      // Log failed transition to trigger shake/flash feedback on the card
      const errMsg = err.message || 'Invalid transition';
      setFailedTransitions(prev => ({
        ...prev,
        [ticketId]: errMsg
      }));

      // Automatically clear the red-flash error after 3 seconds
      setTimeout(() => {
        setFailedTransitions(prev => {
          const updated = { ...prev };
          delete updated[ticketId];
          return updated;
        });
      }, 3500);

      // Re-throw so the card component itself can optionally act on it
      throw err;
    }
  };

  /**
   * Handles ticket deletions.
   */
  const handleDelete = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      
      // Remove from local state
      setTickets(prev => prev.filter(t => t._id !== ticketId));
      
      // Refetch stats silently
      const updatedStats = await fetchStats();
      setStats(updatedStats);
    } catch (err) {
      console.error(`Delete failed for ticket ${ticketId}:`, err);
      throw err;
    }
  };

  /**
   * Handles new ticket creations.
   */
  const handleCreated = async (newTicket) => {
    // Add to ticket list locally at the top
    setTickets(prev => [newTicket, ...prev]);
    
    // Refetch stats silently
    try {
      const updatedStats = await fetchStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Failed to sync stats after ticket creation:', err);
    }
  };

  const handleRetry = () => {
    loadData(true);
  };

  return {
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
  };
}
