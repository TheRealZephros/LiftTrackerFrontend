import React from "react";

type TableProps = {
  config: {
    label: string;
    render: (row: any) => React.ReactNode;
  }[];
  data: any[];
};

const Table = ({ config, data }: TableProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 sm:p-6 xl:p-8 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            {config.map((val, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-left text-sm font-semibold text-yellow-400 uppercase tracking-wider"
              >
                {val.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                className="hover:bg-gray-750 transition-colors duration-150"
              >
                {config.map((val, colIdx) => {
                  const cell = val.render(row);
                  return (
                    <td
                      key={`${row.id ?? rowIdx}-${colIdx}`}
                      className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap"
                    >
                      {cell ?? null}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={config.length}
                className="text-center py-6 text-gray-400 italic"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
