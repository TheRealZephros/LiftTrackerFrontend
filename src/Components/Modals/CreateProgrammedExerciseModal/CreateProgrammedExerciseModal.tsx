import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  ProgrammedExerciseCreateModel,
  ProgrammedExerciseModel,
} from "../../../Models/TrainingProgram";
import { ExerciseModel } from "../../../Models/ExerciseModel";
import { useTrainingProgramService } from "../../../Services/TrainingProgramService";
import { useExerciseService } from "../../../Services/ExerciseService";

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
  const [saving, setSaving] = useState(false);

  const { getAll: getAllExercises } = useExerciseService();
  const { createExercise, updateExercise } = useTrainingProgramService();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getAllExercises();
        setExercises(data);
        setFilteredExercises(data);
      } catch (err) {
        toast.error("Failed to load exercises", { theme: "dark" });
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [getAllExercises]);

  useEffect(() => {
    setFilteredExercises(
      exercises.filter((ex) => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, exercises]);

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

    setSaving(true);
    try {
      const payload: ProgrammedExerciseCreateModel = {
        programDayId,
        exerciseId: Number(selectedExerciseId),
        position: isEditMode ? existingExercise!.position : nextPosition,
        sets,
        reps,
        restTime,
        notes,
      };

      if (isEditMode) {
        await updateExercise(existingExercise!.id, payload);
        toast.success("Exercise updated!", { theme: "dark" });
      } else {
        await createExercise(payload);
        toast.success("Exercise created!", { theme: "dark" });
      }
      await refresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save exercise", { theme: "dark" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="bg-bg2 p-6 rounded-lg w-full max-w-md shadow-lg text-text1">
          Loading exercises...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-bg2 p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4 text-text1">
          {isEditMode ? "Edit Programmed Exercise" : "Add Programmed Exercise"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-text1">Select Exercise</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="w-full mb-2 p-2 rounded-md bg-bg3 text-text1 focus:ring-2 focus:ring-button1"
              disabled={isEditMode || saving}
            />
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
              className="w-full p-2 rounded-md bg-bg3 text-text1 focus:ring-2 focus:ring-button1"
              size={5}
              disabled={isEditMode || saving}
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

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-text1">Sets</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="w-full p-2 rounded-md bg-bg3 text-text1 focus:ring-2 focus:ring-button1"
                required
                disabled={saving}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-text1">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full p-2 rounded-md bg-bg3 text-text1 focus:ring-2 focus:ring-button1"
                required
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-text1">Rest Time (seconds)</label>
            <input
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="w-full p-2 rounded-md bg-bg3 text-text1 focus:ring-2 focus:ring-button1"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-text1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 rounded-md bg-bg3 text-text1 focus:ring-2 focus:ring-button1"
              placeholder="Optional notes..."
              disabled={saving}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-bg4 hover:bg-bg3 text-text1 px-4 py-2 rounded-md"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-button1 hover:bg-button2 text-text1 px-4 py-2 rounded-md"
              disabled={saving}
            >
              {saving ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgrammedExerciseModal;
