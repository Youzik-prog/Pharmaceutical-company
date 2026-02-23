export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function substractDaysFromDate(date: Date, days: number): Date {
  
  const result = new Date(date);

  result.setDate(date.getDate() - days);

  return result;
}

export function substractDaysBetweenTwoDates(date1: Date, date2: Date): number {
  const msPerDay = 86_400_400;

  const datesDifference = Math.abs(date1.getTime() - date2.getTime());

  return Math.floor(datesDifference / msPerDay);
}

export function formatChartDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  
  return `${day} ${month}`;
}

export function getSCCPropertyValue(property: string): string {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(property).trim();
}