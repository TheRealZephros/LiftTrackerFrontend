import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ExerciseSessionModel, ExerciseSessionCreateModel } from "../../../Models/ExerciseSessionModel";
import { ExerciseModel } from "../../../Models/ExerciseModel";
import { createExerciseSession, updateExerciseSession } from "../../../Services/ExerciseSessionService";
import { toast } from "react-toastify";

interface CreateSessionModalProps {
  existingSession?: ExerciseSessionModel;
  onClose: () => void;
  refresh: () => void;
  exercises?: ExerciseModel[];
  onOpenSets: (session: ExerciseSessionModel) => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  existingSession,
  onClose,
  refresh,
  exercises = [],
  onOpenSets,
}) => {
  const isEditMode = !!existingSession;
  const [exerciseId, setExerciseId] = useState<number>(existingSession?.exerciseId || 0);
  const [notes, setNotes] = useState<string>(existingSession?.notes || "");
  const [createdAt, setCreatedAt] = useState<Date>(existingSession ? new Date(existingSession.createdAt) : new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<ExerciseModel[]>(exercises);

  useEffect(() => {
    if (!isEditMode) {
      setFilteredExercises(exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [searchTerm, exercises, isEditMode]);

  const handleSave = async () => {
    if (!exerciseId) {
      toast.error("Please select an exercise", { theme: "dark" });
      return;
    }

    const isoCreatedAt = new Date(createdAt);
    isoCreatedAt.setUTCHours(12, 0, 0, 0);

    try {
      const payload: ExerciseSessionCreateModel = { exerciseId, notes, createdAt: isoCreatedAt.toISOString() };

      let savedSession: ExerciseSessionModel;

      if (isEditMode && existingSession) {
        await updateExerciseSession(existingSession.id, payload);
        toast.success("Session updated!", { theme: "dark" });
        savedSession = { ...existingSession, ...payload };
      } else {
        savedSession = await createExerciseSession(payload);
        toast.success("Session created!", { theme: "dark" });
      }

      refresh();
      onOpenSets(savedSession); // Open Nested Sets Modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to save session", { theme: "dark" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">X</button>
        <h2 className="text-xl font-semibold text-white mb-4">
          {isEditMode ? "Edit Session" : "Create Session"}
        </h2>

        <div className="flex flex-col gap-4">
          <label className="block text-gray-300">Date</label>
          <DatePicker selected={createdAt} onChange={(date: Date | null) => date && setCreatedAt(date)} 
            dateFormat="yyyy-MM-dd" className="w-full p-2 rounded-md bg-gray-700 text-white" />

          <label className="block text-gray-300">Exercise</label>
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search exercises"
            className="w-full p-2 rounded-md bg-gray-700 text-white" />
          <select value={exerciseId} onChange={e => setExerciseId(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-gray-700 text-white" size={5}>
            {filteredExercises.length ? filteredExercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            )) : <option disabled>No exercises found</option>}
          </select>

          <label className="block text-gray-300">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
            className="w-full p-2 rounded-md bg-gray-700 text-white" placeholder="Add notes..." />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
            {isEditMode ? "Save Changes" : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;
