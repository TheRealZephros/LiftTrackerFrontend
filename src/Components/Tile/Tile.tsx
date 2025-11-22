import React from "react";

interface TileProps {
  title: string;
  subTitle: string;
}

const Tile = ({ title, subTitle }: TileProps) => {
  return (
    <div
      className="
        bg-bg2 text-text1 
        border border-bg3 
        rounded-xl shadow-md 
        p-4 m-2
        min-w-[200px] max-w-[300px] 
        flex flex-col justify-between
        hover:shadow-lg transition-shadow duration-200
      "
    >
      {/* Title */}
      <h2 className="text-lg font-semibold text-text2 truncate">
        {title}
      </h2>

      {/* Subtitle */}
      <p
        className="
          text-text1 mt-2 text-sm leading-relaxed
          break-words whitespace-normal
        "
        style={{ maxWidth: "100%" }}
      >
        {subTitle}
      </p>
    </div>
  );
};

export default Tile;
