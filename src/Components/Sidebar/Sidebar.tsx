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
    <nav className="block py-4 px-6 top-0 bottom-0 w-64 bg-bg1 shadow-xl left-0 absolute flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text1">Program Days</h2>
          {onAddDay && (
            <button
              onClick={onAddDay}
              className="p-1 text-button1 hover:text-button2 transition"
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
                  className="flex justify-between items-center bg-bg2 rounded-md px-2 py-2 hover:bg-bg3 transition"
                >
                  <Link
                    to={element.path}
                    className="flex items-center gap-2 text-text1 text-sm font-medium"
                  >
                    {element.icon && <element.icon />} {element.label}
                  </Link>
                  {onDeleteDay && (
                    <button
                      onClick={() => onDeleteDay(dayId)}
                      className="text-buttonDelete1 hover:text-buttonDelete2"
                      title="Delete day"
                    >
                      {FiTrash2({ size: 16 })}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-text3 italic">No days yet.</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
