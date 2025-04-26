export const formatTime = (timeInSeconds: number | null | undefined): string => {
  // If the input time is falsy (null, undefined, or 0), return the default value
  if (!timeInSeconds) {
    return "--:--";
  }

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(timeInSeconds / 3600); // Get the number of hours
  const minutes = Math.floor((timeInSeconds % 3600) / 60); // Get the number of minutes
  const seconds = Math.floor(timeInSeconds % 60); // Get the number of seconds

  // Format the time based on hours, minutes, and seconds
  if (hours > 0) {
    // If there's an hour, return in hh:mm:ss format
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  } else {
    // If there's no hour, return in mm:ss format
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }
};
