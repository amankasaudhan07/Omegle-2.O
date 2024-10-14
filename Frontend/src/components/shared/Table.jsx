import React from 'react';

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <div className="container mx-auto h-screen px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
        <h2 className="text-2xl font-bold text-center uppercase my-8">
          {heading}
        </h2>
        <div className="flex-grow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                {columns.map((column) => (
                  <th 
                    key={column.field} 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {column.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                <tr key={row.id} style={{ height: `${rowHeight}px` }}>
                  {columns.map((column) => (
                    <td 
                      key={`${row.id}-${column.field}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {column.renderCell 
                        ? column.renderCell({ row, value: row[column.field] }) 
                        : row[column.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;