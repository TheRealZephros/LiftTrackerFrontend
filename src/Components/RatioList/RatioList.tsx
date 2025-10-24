type RatioListProps = {
  config: any[];
  data: any;
};

const RatioList = ({ config, data }: RatioListProps) => {
  const renderedRows = config.map((row: any) => {
    const value = row.render(data);

    return (
      <li
        key={row.label}
        className="py-3 px-3 hover:bg-gray-700/40 transition-colors rounded-md"
      >
        <div className="flex flex-col space-y-1">
          {/* Label */}
          <p className="text-sm font-medium text-yellow-400 truncate">
            {row.label}
          </p>

          {/* Optional subtitle */}
          {row.subTitle && (
            <p className="text-xs text-gray-400">{row.subTitle}</p>
          )}

          {/* Rendered content / description */}
          <div
            className="text-sm text-gray-200 mt-1 leading-relaxed break-words"
            style={{
              maxWidth: "400px",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {typeof value === "string" ? value : value}
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 sm:p-5">
      <ul className="divide-y divide-gray-700 space-y-2">{renderedRows}</ul>
    </div>
  );
};

export default RatioList;
