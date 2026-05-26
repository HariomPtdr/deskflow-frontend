/**
 * Formats a duration in minutes to a shorthand human readable string.
 * @param {number} minutes - The age of the ticket in minutes
 * @returns {string} - Shorthand format (e.g. '25m', '3h 12m', '2d 6h')
 */
export function formatAge(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
    return '0m';
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    return `${hours}h ${remMins}m`;
  }

  const days = Math.floor(minutes / 1440);
  const remHours = Math.floor((minutes % 1440) / 60);
  return `${days}d ${remHours}h`;
}
