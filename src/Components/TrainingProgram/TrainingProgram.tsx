import React from "react";
import { Outlet } from "react-router-dom";

interface TrainingProgramProps {
  children: React.ReactNode;
  programId: string;
}

const TrainingProgram = ({ children, programId }: TrainingProgramProps) => {
  return (
    <div>
      <div className="relative md:ml-64 bg-blueGray-100 w-full">
        <div className="relative pt-20 pb-32 bg-lightbuttonEdit2">
          <div className="px-4 md:px-6 mx-auto w-full">
            <div>
              <div className="flex flex-wrap">{children}</div>
              <div className="flex flex-wrap"><Outlet context={programId} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgram;
