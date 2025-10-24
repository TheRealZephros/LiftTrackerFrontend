import React, { useState, useEffect } from "react";
import { ExerciseSessionModel, ExerciseSetModel, ExerciseSetCreateModel, ExerciseSetUpdateModel } from "../../../Models/ExerciseSessionModel";
import { createExerciseSet, updateExerciseSet, deleteExerciseSet } from "../../../Services/ExerciseSessionService";
import { toast } from "react-toastify";
import Table from "../../Table/Table";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface NestedSetsModalProps {
  session: ExerciseSessionModel;
  onClose: () => void;
  refresh: () => void;
}

const NestedSetsModal: React.FC<NestedSetsModalProps> = ({ session, onClose, refresh }) => {
  const [sets, setSets] = useState<ExerciseSetModel[]>(session.sets || []);
  const [newSet, setNewSet] = useState<Partial<ExerciseSetCreateModel>>({ repetitions: 0, weight: 0 });

  const handleAddSet = async () => {
    if (!newSet.repetitions || !newSet.weight) return;
    try {
      const created = await createExerciseSet({
        exerciseSessionId: session.id,
        repetitions: newSet.repetitions!,
        weight: newSet.weight!,
      });
      setSets(prev => [...prev, created]);
      toast.success("Set added!", { theme: "dark" });
      setNewSet({ repetitions: 0, weight: 0 });
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add set", { theme: "dark" });
    }
  };

  const handleUpdateSet = async (setId: number, updated: ExerciseSetUpdateModel) => {
    try {
      await updateExerciseSet(setId, updated);
      setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updated } : s));
      toast.success("Set updated!", { theme: "dark" });
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update set", { theme: "dark" });
    }
  };

  const handleDeleteSet = async (setId: number) => {
    if (!window.confirm("Delete this set?")) return;
    try {
      await deleteExerciseSet(setId);
      setSets(prev => prev.filter(s => s.id !== setId));
      toast.success("Set deleted!", { theme: "dark" });
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete set", { theme: "dark" });
    }
  };

  const columns = [
    { label: "Repetitions", render: (row: ExerciseSetModel) => row.repetitions },
    { label: "Weight", render: (row: ExerciseSetModel) => row.weight },
    {
      label: "Actions",
      render: (row: ExerciseSetModel) => (
        <div className="flex gap-2">
          <button
            className="p-1 text-blue-400 hover:text-blue-500 transition"
            title="Edit Set"
            onClick={() => {
              const reps = parseInt(prompt("Repetitions:", row.repetitions.toString()) || "0");
              const weight = parseFloat(prompt("Weight:", row.weight.toString()) || "0");
              handleUpdateSet(row.id, { repetitions: reps, weight });
            }}
          >
            {FiEdit2({ size: 18 })}
          </button>
          <button
            className="p-1 text-red-400 hover:text-red-500 transition"
            title="Delete Set"
            onClick={() => handleDeleteSet(row.id)}
          >
            {FiTrash2({ size: 18 })}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-gray-800 text-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">X</button>

        <h2 className="text-xl font-semibold mb-4">Sets for Session #{session.id}</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={newSet.repetitions || ""}
            onChange={(e) => setNewSet(prev => ({ ...prev, repetitions: parseInt(e.target.value) }))}
            placeholder="Reps"
            className="bg-gray-700 p-2 rounded-md w-24 text-white"
          />
          <input
            type="number"
            value={newSet.weight || ""}
            onChange={(e) => setNewSet(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
            placeholder="Weight"
            className="bg-gray-700 p-2 rounded-md w-24 text-white"
          />
          <button onClick={handleAddSet} className="bg-yellow-500 hover:bg-yellow-600 px-4 rounded-md">Add Set</button>
        </div>

        <Table config={columns} data={sets} />
      </div>
    </div>
  );
};

export default NestedSetsModal;
