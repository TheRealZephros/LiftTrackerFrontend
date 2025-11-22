import React, { useState } from "react";
import { ExerciseSessionModel } from "../../../Models/ExerciseSessionModel";
import { ExerciseModel } from "../../../Models/ExerciseModel";
import Table from "../../Table/Table";
import CreateSessionModal from "../CreateSessionModal/CreateSessionModal";
import { FiEdit, FiEdit2, FiPlus } from "react-icons/fi";

interface ExerciseSessionModalProps {
  day?: string;
  sessions?: ExerciseSessionModel[];
  exercises?: Record<number, ExerciseModel>;
  onClose: () => void;
  refresh: () => Promise<void>;
  onOpenSets: (session: ExerciseSessionModel) => void;
}

const ExerciseSessionModal: React.FC<ExerciseSessionModalProps> = ({
  day,
  sessions = [],
  exercises = {},
  onClose,
  refresh,
  onOpenSets,
}) => {
  const [editingSession, setEditingSession] = useState<ExerciseSessionModel | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleOpenCreate = () => {
    setEditingSession(null);
    setShowSessionModal(true);
  };

  const columns = [
    {
      label: "Exercise",
      render: (row: ExerciseSessionModel) => exercises[row.exerciseId]?.name || "Unknown",
    },
    {
      label: "Notes",
      render: (row: ExerciseSessionModel) => row.notes || "-",
    },
    {
      label: "Sets",
      render: (row: ExerciseSessionModel) => row.sets?.length || 0,
    },
    {
      label: "Actions",
      render: (row: ExerciseSessionModel) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingSession(row);
              setShowSessionModal(true);
            }}
            className="text-buttonEdit1 hover:text-buttonEdit2"
          >
            {FiEdit2({ size: 18 })}
          </button>
          <button
            onClick={() => onOpenSets(row)}
            className="text-button1 hover:text-button2"
          >
            {FiEdit({ size: 18 })}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg2 text-text1 rounded-xl p-6 w-full max-w-4xl shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {day ? new Date(day).toLocaleDateString() : "Exercise Sessions"}
          </h2>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1 bg-button1 hover:bg-button2 text-text1 px-3 py-1 rounded-md"
            >
              {FiPlus({ size: 16 })} Add Session
            </button>
            <button
              onClick={onClose}
              className="text-text3 hover:text-text1 px-2 py-1 rounded-md"
            >
              X
            </button>
          </div>
        </div>

        {/* Table or Empty State */}
        {sessions.length > 0 ? (
          <Table config={columns} data={sessions} />
        ) : (
          <div className="text-text3 py-4 text-center">No sessions yet</div>
        )}

        {/* Create/Edit Modal */}
        {showSessionModal && (
          <CreateSessionModal
            existingSession={editingSession || undefined}
            onClose={() => setShowSessionModal(false)}
            refresh={refresh}
            exercises={Object.values(exercises)}
            onOpenSets={onOpenSets}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseSessionModal;
