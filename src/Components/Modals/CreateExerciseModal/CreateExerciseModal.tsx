import React, { useState, useEffect } from "react";
import { ExerciseCreateModel, ExerciseModel } from "../../../Models/ExerciseModel";
import { FiX } from "react-icons/fi";

interface CreateExerciseModalProps {
  onClose: () => void;
  onSave: (exercise: ExerciseCreateModel) => void;
  existingExercise?: ExerciseModel;
}

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  onClose,
  onSave,
  existingExercise,
}) => {
  const isEditMode = !!existingExercise;

  const [name, setName] = useState(existingExercise?.name || "");
  const [description, setDescription] = useState(existingExercise?.description || "");

  useEffect(() => {
    if (existingExercise) {
      setName(existingExercise.name);
      setDescription(existingExercise.description);
    }
  }, [existingExercise]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a name for the exercise.");
      return;
    }

    const exerciseData: ExerciseCreateModel = { name, description };
    onSave(exerciseData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          {FiX({ size: 20 })}
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">
          {isEditMode ? "Edit Exercise" : "Create New Exercise"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g., Bench Press"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-500"
              placeholder="Describe the exercise..."
            />
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
              {isEditMode ? "Save Changes" : "Create Exercise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExerciseModal;
