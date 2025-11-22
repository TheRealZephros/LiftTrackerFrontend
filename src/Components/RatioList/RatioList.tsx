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
        className="py-3 px-3 hover:bg-bg3/40 transition-colors rounded-md"
      >
        <div className="flex flex-col space-y-1">
          {/* Label */}
          <p className="text-sm font-medium text-text2 truncate">
            {row.label}
          </p>

          {/* Optional subtitle */}
          {row.subTitle && (
            <p className="text-xs text-text3">{row.subTitle}</p>
          )}

          {/* Rendered content / description */}
          <div
            className="text-sm text-text1 mt-1 leading-relaxed break-words"
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
    <div className="bg-bg2 border border-bg3 rounded-lg shadow-md p-4 sm:p-5">
      <ul className="divide-y divide-bg3 space-y-2">{renderedRows}</ul>
    </div>
  );
};

export default RatioList;
