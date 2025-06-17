const formatDate = (isoDateString: string, withHour: boolean = false): string => {
  const date = new Date(isoDateString);

  const dateStr = date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  if (!withHour) return dateStr;

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${dateStr} ${timeStr}`;
};

export default formatDate;
