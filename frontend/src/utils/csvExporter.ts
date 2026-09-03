export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  formatter?: (value: any, item: T) => string;
}

export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  data: T[],
  columns: ExportColumn<T>[]
): void {
  if (!data || !data.length) return;

  const headers = columns.map(col => `"${col.label.replace(/"/g, '""')}"`).join(',');

  const rows = data.map(item => {
    return columns.map(col => {
      let rawValue: any;
      if (typeof col.key === 'string' && col.key.includes('.')) {
        const parts = col.key.split('.');
        rawValue = parts.reduce((acc, part) => acc && acc[part], item);
      } else {
        rawValue = item[col.key as string];
      }

      if (col.formatter) {
        rawValue = col.formatter(rawValue, item);
      }

      if (rawValue === null || rawValue === undefined) {
        rawValue = '';
      }

      const strValue = String(rawValue).replace(/"/g, '""');
      return `"${strValue}"`;
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
