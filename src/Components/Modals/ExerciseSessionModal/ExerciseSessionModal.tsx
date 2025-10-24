// Skeleton for modal
import React, { useState } from "react";
import { ExerciseSessionModel } from "../../../Models/ExerciseSessionModel";
import { ExerciseModel } from "../../../Models/ExerciseModel";
import Table from "../../Table/Table";
import CreateSessionModal from "../CreateSessionModal/CreateSessionModal";

interface ExerciseSessionModalProps {
  day?: string;
  sessions?: ExerciseSessionModel[];
  exercises?: Record<number, ExerciseModel>;
  onClose: () => void;
  refresh: () => Promise<void>;
}

const ExerciseSessionModal: React.FC<ExerciseSessionModalProps> = ({ day, sessions = [], exercises = {}, onClose, refresh }) => {
  const [editingSession, setEditingSession] = useState<ExerciseSessionModel | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const columns = [
    { label: "Exercise", render: (row: ExerciseSessionModel) => exercises[row.exerciseId]?.name || "Unknown" },
    { label: "Notes", render: (row: ExerciseSessionModel) => row.notes },
    { label: "Sets", render: (row: ExerciseSessionModel) => row.sets.length },
    { label: "Actions", render: (row: ExerciseSessionModel) => (
      <div className="flex gap-2">
        <button onClick={() => { setEditingSession(row); setShowSessionModal(true); }} className="text-blue-400 hover:text-blue-500">Edit</button>
      </div>
    ) }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-4xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{day ? new Date(day).toLocaleDateString() : "New Session"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">X</button>
        </div>

        {day && <Table config={columns} data={sessions} />}

        {showSessionModal && (
            <CreateSessionModal
                existingSession={editingSession || undefined}
                onClose={() => setShowSessionModal(false)}
                refresh={refresh}
                exercises={Object.values(exercises)} // ✅ convert Record<number, ExerciseModel> to array
            />
        )}
      </div>
    </div>
  );
};

export default ExerciseSessionModal;
