import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  ExerciseSessionModel,
  ExerciseSessionCreateModel,
} from "../../../Models/ExerciseSessionModel";
import { ExerciseModel } from "../../../Models/ExerciseModel";
import { useExerciseSessionService } from "../../../Services/ExerciseSessionService";

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
  const [notes, setNotes] = useState(existingSession?.notes || "");
  const [createdAt, setCreatedAt] = useState<Date>(
    existingSession ? new Date(existingSession.createdAt) : new Date()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<ExerciseModel[]>(exercises);
  const [loading, setLoading] = useState(false);

  const service = useExerciseSessionService();

  useEffect(() => {
    if (!isEditMode) {
      setFilteredExercises(
        exercises.filter((ex) =>
          ex.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, exercises, isEditMode]);

  const handleSave = async () => {
    if (!exerciseId) {
      toast.error("Please select an exercise", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const isoCreatedAt = new Date(createdAt);
      isoCreatedAt.setUTCHours(12, 0, 0, 0);

      const payload: ExerciseSessionCreateModel = {
        exerciseId,
        notes,
        createdAt: isoCreatedAt.toISOString(),
      };

      let savedSession: ExerciseSessionModel;

      if (isEditMode && existingSession) {
        await service.updateSession(existingSession.id, payload);
        toast.success("Session updated!", { theme: "dark" });
        savedSession = { ...existingSession, ...payload };
      } else {
        savedSession = await service.createSession(payload);
        toast.success("Session created!", { theme: "dark" });
      }

      refresh();
      onOpenSets(savedSession);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save session", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-bg2 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text3 hover:text-text1"
        >
          X
        </button>
        <h2 className="text-xl font-semibold text-text1 mb-4">
          {isEditMode ? "Edit Session" : "Create Session"}
        </h2>

        <div className="flex flex-col gap-4">
          <label className="block text-text3">Date</label>
          <DatePicker
            selected={createdAt}
            onChange={(date: Date | null) => date && setCreatedAt(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 rounded-md bg-bg3 text-text1"
            disabled={loading}
          />

          <label className="block text-text3">Exercise</label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises"
            className="w-full p-2 rounded-md bg-bg3 text-text1"
            disabled={isEditMode || loading}
          />
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-bg3 text-text1"
            size={5}
            disabled={loading}
          >
            {filteredExercises.length ? (
              filteredExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))
            ) : (
              <option disabled>No exercises found</option>
            )}
          </select>

          <label className="block text-text3">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full p-2 rounded-md bg-bg3 text-text1"
            placeholder="Add notes..."
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSave}
            className="bg-button1 hover:bg-button2 text-text1 px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;
