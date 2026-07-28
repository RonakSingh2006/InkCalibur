export function isMonthQuery(query: string): boolean {
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  const lower = query.toLowerCase();
  return monthNames.includes(lower) || /^(0?[1-9]|1[0-2])$/.test(query);
}

export function monthStart(query: string): Date {
  const lower = query.toLowerCase();
  const monthMap: Record<string, number> = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };
  const month = monthMap[lower] ?? (parseInt(lower) - 1);
  const year = new Date().getFullYear();
  return new Date(year, month, 1);
}

export function monthEnd(query: string): Date {
  const lower = query.toLowerCase();
  const monthMap: Record<string, number> = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };
  const month = monthMap[lower] ?? (parseInt(lower) - 1);
  const year = new Date().getFullYear();
  return new Date(year, month + 1, 1);
}