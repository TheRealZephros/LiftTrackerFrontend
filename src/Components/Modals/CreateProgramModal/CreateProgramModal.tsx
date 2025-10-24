import React, { useState, useEffect } from "react";
import { TrainingProgramUpdateModel } from "../../../Models/TrainingProgram";

interface CreateProgramModalProps {
  onClose: () => void;
  onCreate: (program: TrainingProgramUpdateModel) => void;
  program?: TrainingProgramUpdateModel; // optional for edit
}

const CreateProgramModal: React.FC<CreateProgramModalProps> = ({ onClose, onCreate, program }) => {
  const [name, setName] = useState(program?.name || "");
  const [description, setDescription] = useState(program?.description || "");
  const [isWeekDaySynced, setIsWeekDaySynced] = useState(program?.isWeekDaySynced || false);

  // Update form values if program prop changes (important for edit)
  useEffect(() => {
    if (program) {
      setName(program.name);
      setDescription(program.description);
      setIsWeekDaySynced(program.isWeekDaySynced);
    }
  }, [program]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    const programData: TrainingProgramUpdateModel = {
      name,
      description,
      isWeekDaySynced,
    };

    onCreate(programData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {program ? "Edit Training Program" : "Create Training Program"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isWeekDaySynced}
              onChange={(e) => setIsWeekDaySynced(e.target.checked)}
              id="weekday-sync"
            />
            <label htmlFor="weekday-sync" className="text-sm">
              Sync to weekdays
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
            >
              {program ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgramModal;
