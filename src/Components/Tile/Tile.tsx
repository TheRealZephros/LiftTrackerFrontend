import React from "react";

interface TileProps {
  title: string;
  subTitle: string;
}

const Tile = ({ title, subTitle }: TileProps) => {
  return (
    <div
      className="
        flex flex-col 
        border rounded-lg p-4 m-2
        min-w-fit max-w-[25%] 
        shrink-0 grow
      "
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-400 break-words whitespace-normal">{subTitle}</p>
    </div>
  );
};

export default Tile;
