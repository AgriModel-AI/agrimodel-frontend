export function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Format day and month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., "Nov"
    
    // Format year, hour, and minute
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year} ${hours}:${minutes}`;
}