import React from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus } from "react-icons/fi";

interface SidebarProps {
  elements: { path: string; icon?: React.FC; label: string }[] | null;
  onAddDay?: () => void;
  onDeleteDay?: (dayId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ elements, onAddDay, onDeleteDay }) => {
  return (
    <nav className="block py-4 px-6 top-0 bottom-0 w-64 bg-gray-900 shadow-xl left-0 absolute flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Program Days</h2>
          {onAddDay && (
            <button
              onClick={onAddDay}
              className="p-1 text-yellow-400 hover:text-yellow-500 transition"
              title="Add new day"
            >
              {FiPlus({ size: 16 })}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {elements && elements.length > 0 ? (
            elements.map((element) => {
              const dayId = parseInt(element.path, 10);
              return (
                <div
                  key={element.path}
                  className="flex justify-between items-center bg-gray-800 rounded-md px-2 py-2 hover:bg-gray-700 transition"
                >
                  <Link
                    to={element.path}
                    className="flex items-center gap-2 text-white text-sm font-medium"
                  >
                    {element.icon && <element.icon />} {element.label}
                  </Link>
                  {onDeleteDay && (
                    <button
                      onClick={() => onDeleteDay(dayId)}
                      className="text-red-400 hover:text-red-600"
                      title="Delete day"
                    >
                      {FiTrash2({ size: 16 })}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 italic">No days yet.</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
