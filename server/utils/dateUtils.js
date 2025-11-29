// Calculate business days between two dates (excluding weekends)
const calculateBusinessDays = (startDate, endDate) => {
  let count = 0;
  const currentDate = new Date(startDate);

  // Ensure we're working with date objects
  currentDate.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  // Iterate through each day
  while (currentDate <= end) {
    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = currentDate.getDay();

    // Count only weekdays (Monday to Friday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};

// Check if a date is a weekend
const isWeekend = (date) => {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};

// Check if a date is in the past
const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

module.exports = {
  calculateBusinessDays,
  isWeekend,
  isPastDate,
};
