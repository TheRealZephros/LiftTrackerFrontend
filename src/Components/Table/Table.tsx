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
    <div className="bg-bg2 border border-bg3 rounded-lg shadow-md p-4 sm:p-6 xl:p-8 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-bg3">
            {config.map((val, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-left text-sm font-semibold text-text2 uppercase tracking-wider"
              >
                {val.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-bg3">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                className="hover:bg-bg transition-colors duration-150"
              >
                {config.map((val, colIdx) => {
                  const cell = val.render(row);
                  return (
                    <td
                      key={`${row.id ?? rowIdx}-${colIdx}`}
                      className="px-4 py-3 text-sm text-text1 whitespace-nowrap"
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
                className="text-center py-6 text-text1 italic"
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
