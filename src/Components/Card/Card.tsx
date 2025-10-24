import React from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { TrainingProgramAllModel } from "../../Models/TrainingProgram";

interface ProgramCardProps {
  program: TrainingProgramAllModel;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const Card: React.FC<ProgramCardProps> = ({ program, onDelete, onEdit }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700 hover:shadow-lg transition-transform transform hover:scale-[1.02] flex flex-col justify-between">
      {/* Program Name */}
      <div>
        <Link
          to={`/programs/${program.id}`}
          className="text-lg font-semibold text-yellow-400 hover:underline truncate block"
        >
          {program.name}
        </Link>
      </div>

      {/* Footer / Actions */}
      <div className="flex justify-between items-center mt-4">
        <span className="px-2 py-1 text-xs rounded-full bg-blue-700 text-blue-300">
          Program ID: {program.id}
        </span>

        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(program.id)}
              className="p-1 text-blue-400 hover:text-blue-500 transition"
              title="Edit Program"
            >
              {FiEdit2({ size: 18 })}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(program.id)}
              className="p-1 text-red-400 hover:text-red-500 transition"
              title="Delete Program"
            >
              {FiTrash2({ size: 18 })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
