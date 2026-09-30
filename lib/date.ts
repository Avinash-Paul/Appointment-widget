function parseLocalDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

export function formatWeekday(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(
    parseLocalDate(value),
  );
}

export function formatDay(value: string) {
  return new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
    parseLocalDate(value),
  );
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(parseLocalDate(value));
}

export function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
