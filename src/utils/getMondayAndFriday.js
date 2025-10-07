export function getLastFridayDate(current) {
  const day = current.getDay();
  const diff = (day + 2) % 7; // how many days since Friday (5)
  const friday = new Date(current);
  friday.setDate(current.getDate() - diff);
  friday.setHours(0, 0, 0, 0);
  return friday;
}

export function getNextMondayDate(current) {
  const day = current.getDay();
  const diff = (8 - day) % 7; // next Monday
  const monday = new Date(current);
  monday.setDate(current.getDate() + diff);
  monday.setHours(23, 59, 59, 999);
  return monday;
}