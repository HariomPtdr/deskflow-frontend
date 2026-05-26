const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to check and parse response
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await response.json();
      errorMsg = data.error || (data.errors && data.errors.map(e => e.message).join(', ')) || errorMsg;
    } catch (e) {
      // JSON parsing failed
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

/**
 * Fetch all tickets matching filters
 * @param {Object} filters - { status, priority, breached }
 */
export async function fetchTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.breached) params.append('breached', 'true');

  const queryString = params.toString();
  const url = `${API_BASE_URL}/tickets${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  return handleResponse(response);
}

/**
 * Fetch ticket aggregate statistics
 */
export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/tickets/stats`);
  return handleResponse(response);
}

/**
 * Create a new ticket
 * @param {Object} data - { subject, description, customerEmail, priority }
 */
export async function createTicket(data) {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Update a ticket's status
 * @param {string} id - Ticket ID
 * @param {string} status - New status string
 */
export async function updateTicketStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse(response);
}

/**
 * Delete a ticket by ID
 * @param {string} id - Ticket ID
 */
export async function deleteTicket(id) {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
}
