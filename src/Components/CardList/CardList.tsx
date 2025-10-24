import React from "react";
import Card from "../Card/Card";
import { TrainingProgramAllModel } from "../../Models/TrainingProgram";

interface ProgramCardListProps {
  programs: TrainingProgramAllModel[];
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const ProgramCardList: React.FC<ProgramCardListProps> = ({
  programs,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex justify-center">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 max-w-6xl w-full">
        {programs.length > 0 ? (
          programs.map((program) => (
            <Card
              key={program.id.toString()}
              program={program}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 italic text-lg mt-8 col-span-full">
            No programs found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgramCardList;
