export function stringToDate(date: string): Date {
    return new Date(date);
}

export function formatDate(date: string): string {
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    return dateFormatter.format(stringToDate(date));
}

export function progressPercentage(total: number, current: number): number {
    return (current / total) * 100;
  }