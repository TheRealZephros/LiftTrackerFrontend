import React, { useState, useEffect, useRef } from "react";
import { ExerciseSessionModel, ExerciseSessionCreateModel } from "../../../Models/ExerciseSessionModel";
import { ExerciseModel } from "../../../Models/ExerciseModel";
import { createExerciseSession, updateExerciseSession } from "../../../Services/ExerciseSessionService";
import { toast } from "react-toastify";
import NestedSetsModal from "./NestedSetsModal";
import { FiSearch } from "react-icons/fi";

interface CreateSessionModalProps {
  existingSession?: ExerciseSessionModel;
  onClose: () => void;
  refresh: () => void;
  exercises?: ExerciseModel[]; // list of all exercises
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  existingSession,
  onClose,
  refresh,
  exercises = [],
}) => {
  const isEditMode = !!existingSession;

  const [exerciseId, setExerciseId] = useState<number>(existingSession?.exerciseId || 0);
  const [notes, setNotes] = useState<string>(existingSession?.notes || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<ExerciseModel[]>(exercises);
  const [setsModalOpen, setSetsModalOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Prefill data when editing
  useEffect(() => {
    if (existingSession) {
      setExerciseId(existingSession.exerciseId);
      setNotes(existingSession.notes);
      const selected = exercises.find((ex) => ex.id === existingSession.exerciseId);
      if (selected) setSearchTerm(selected.name);
    }
  }, [existingSession, exercises]);

  // Filter exercises based on search term
  useEffect(() => {
    if (!isEditMode) {
      const filtered = exercises.filter((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [searchTerm, exercises, isEditMode]);

  const handleSelectExercise = (ex: ExerciseModel) => {
    if (isEditMode) return; // prevent changing exercise in edit mode
    setExerciseId(ex.id);
    setSearchTerm(ex.name);
  };

  const handleSave = async () => {
    if (!exerciseId) {
      toast.error("Please select an exercise", { theme: "dark" });
      return;
    }

    try {
      const payload: ExerciseSessionCreateModel = { exerciseId, notes };
      if (isEditMode && existingSession) {
        await updateExerciseSession(existingSession.id, payload);
        toast.success("Session updated!", { theme: "dark" });
      } else {
        await createExerciseSession(payload);
        toast.success("Session created!", { theme: "dark" });
      }
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save session", { theme: "dark" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          X
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">
          {isEditMode ? "Edit Session" : "Create Session"}
        </h2>

        <div className="flex flex-col gap-4">
          {/* Exercise Selector */}
          <div className="relative" ref={searchRef}>
            <label className="block text-gray-300 mb-1">Exercise</label>
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">
              Select Exercise
            </label>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search exercises..."
                className="w-full mb-2 p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
                />

                <select
                value={exerciseId}
                onChange={(e) => {
                    const newId = Number(e.target.value);
                    setExerciseId(newId);
                    const ex = exercises.find((x) => x.id === newId);
                    if (ex) setSearchTerm(ex.name);
                }}
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
                size={5}
                >
                {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                    </option>
                    ))
                ) : (
                    <option disabled>No exercises found</option>
                )}
                </select>

          </div>

            {/* Dropdown */}
            {!isEditMode && searchTerm && filteredExercises.length > 0 && (
              <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1">
                {filteredExercises.map((ex) => (
                  <li
                    key={ex.id}
                    onClick={() => handleSelectExercise(ex)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
                      exerciseId === ex.id ? "bg-gray-700" : ""
                    }`}
                  >
                    {ex.name}
                  </li>
                ))}
              </ul>
            )}

            {!isEditMode && searchTerm && filteredExercises.length === 0 && (
              <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1 px-3 py-2 text-gray-400">
                No exercises found
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-300 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-500"
              placeholder="Add any notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setSetsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Manage Sets
            </button>

            <button
              onClick={handleSave}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
            >
              {isEditMode ? "Save Changes" : "Create Session"}
            </button>
          </div>
        </div>

        {/* Nested Sets Modal */}
        {setsModalOpen && existingSession && (
          <NestedSetsModal
            session={existingSession}
            onClose={() => setSetsModalOpen(false)}
            refresh={refresh}
          />
        )}
      </div>
    </div>
  );
};

export default CreateSessionModal;
