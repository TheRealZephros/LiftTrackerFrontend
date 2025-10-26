import React, { useState, useEffect } from "react";
import {
  ProgrammedExerciseCreateModel,
  ProgrammedExerciseModel,
} from "../../../Models/TrainingProgram";
import {
  getAllExercises,
} from "../../../Services/ExerciseService";
import {
  createProgrammedExercise,
  updateProgrammedExercise,
} from "../../../Services/TrainingProgramService";
import { ExerciseModel } from "../../../Models/ExerciseModel";
import { toast } from "react-toastify";

interface CreateProgrammedExerciseModalProps {
  onClose: () => void;
  refresh: () => Promise<void>;
  programDayId: number;
  nextPosition: number;
  existingExercise?: ProgrammedExerciseModel;
}

const CreateProgrammedExerciseModal: React.FC<CreateProgrammedExerciseModalProps> = ({
  onClose,
  refresh,
  programDayId,
  nextPosition,
  existingExercise,
}) => {
  const isEditMode = !!existingExercise;

  const [exercises, setExercises] = useState<ExerciseModel[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | "">("");
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [restTime, setRestTime] = useState<number>(60);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getAllExercises();
        setExercises(data);
        setFilteredExercises(data);
      } catch (error) {
        toast.error("Failed to load exercises", { theme: "dark" });
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises
  useEffect(() => {
    const filtered = exercises.filter((ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchTerm, exercises]);

  // Prefill data in edit mode
  useEffect(() => {
    if (existingExercise) {
      setSelectedExerciseId(existingExercise.exerciseId);
      setSets(existingExercise.sets);
      setReps(existingExercise.reps);
      setRestTime(existingExercise.restTime);
      setNotes(existingExercise.notes || "");
      const existing = exercises.find((ex) => ex.id === existingExercise.exerciseId);
      if (existing) setSearchTerm(existing.name);
    }
  }, [existingExercise, exercises]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExerciseId) {
      toast.error("Please select an exercise", { theme: "dark" });
      return;
    }

    const payload: ProgrammedExerciseCreateModel = {
      programDayId,
      exerciseId: Number(selectedExerciseId),
      position: isEditMode ? existingExercise!.position : nextPosition,
      sets,
      reps,
      restTime,
      notes,
    };

    try {
      if (isEditMode) {
        await updateProgrammedExercise(existingExercise!.id, payload);
        toast.success("Exercise updated!", { theme: "dark" });
      } else {
        await createProgrammedExercise(payload);
        toast.success("Exercise created!", { theme: "dark" });
      }
      await refresh();
      onClose();
    } catch (error) {
      toast.error("Failed to save exercise", { theme: "dark" });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg text-white">
          Loading exercises...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {isEditMode ? "Edit Programmed Exercise" : "Add Programmed Exercise"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Exercise Selector */}
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
              disabled={isEditMode}
            />

            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
              size={5}
              disabled={isEditMode}
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

          {/* Sets & Reps */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-200">
                Sets
              </label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-200">
                Reps
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          </div>

          {/* Rest Time */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">
              Rest Time (seconds)
            </label>
            <input
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
              placeholder="Optional notes..."
            />
          </div>

          {/* Buttons */}
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
              {isEditMode ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgrammedExerciseModal;
