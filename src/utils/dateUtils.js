/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date to ISO string format (YYYY-MM-DD)
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parse a date string into a Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date} - Date object
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

/**
 * Get a formatted date range string
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} - Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Get date for N days ago
 * @param {number} days - Number of days to go back
 * @returns {Date} - Date object
 */
export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};