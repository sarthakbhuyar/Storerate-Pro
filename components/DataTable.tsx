
import React, { useState, useMemo } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filterText?: string;
  filterFields?: (keyof T)[];
  emptyMessage?: string;
}

const DataTable = <T extends Record<string, any>>({ 
  data, 
  columns, 
  filterText = '', 
  filterFields = [],
  emptyMessage = "No records found"
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (filterText && filterFields.length > 0) {
      result = result.filter(item => 
        filterFields.some(field => 
          String(item[field]).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filterText, filterFields, sortConfig]);

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                onClick={() => col.sortable !== false && requestSort(col.accessor)}
              >
                <div className="flex items-center space-x-1">
                  <span>{col.header}</span>
                  {col.sortable !== false && sortConfig?.key === col.accessor && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processedData.length > 0 ? (
            processedData.map((item, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {col.render ? col.render(item) : String(item[col.accessor])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500 italic">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
