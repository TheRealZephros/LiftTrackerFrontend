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
    <div className="bg-bg2 rounded-lg p-4 shadow-md border border-bg3 hover:shadow-lg transition-transform transform hover:scale-[1.02] flex flex-col justify-between">
      {/* Program Name */}
      <div>
        <Link
          to={`/programs/${program.id}`}
          className="text-lg font-semibold text-text2 hover:underline truncate block"
        >
          {program.name}
        </Link>
      </div>

      {/* Footer / Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(program.id)}
              className="p-1 text-buttonEdit1 hover:text-buttonEdit2 transition"
              title="Edit Program"
            >
              {FiEdit2({ size: 18 })}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(program.id)}
              className="p-1 text-buttonDelete1 hover:text-buttonDelete2 transition"
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
