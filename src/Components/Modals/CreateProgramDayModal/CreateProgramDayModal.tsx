import React, { useState } from "react";
import { toast } from "react-toastify";
import { ProgramDayCreateModel, ProgramDayUpdateModel, ProgramDayModel } from "../../../Models/TrainingProgram";
import { useTrainingProgramService } from "../../../Services/TrainingProgramService";

interface CreateProgramDayModalProps {
  onClose: () => void;
  trainingProgramId: number;
  nextPosition: number;
  refresh?: () => Promise<void>;
  existingDay?: ProgramDayModel; // optional for edit
}

const CreateProgramDayModal: React.FC<CreateProgramDayModalProps> = ({
  onClose,
  trainingProgramId,
  nextPosition,
  refresh,
  existingDay,
}) => {
  const isEditMode = !!existingDay;

  const [name, setName] = useState(existingDay?.name || "");
  const [description, setDescription] = useState(existingDay?.description || "");
  const [notes, setNotes] = useState(existingDay?.notes || "");
  const [loading, setLoading] = useState(false);

  const { createDay, updateDay } = useTrainingProgramService();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim()) {
    toast.error("Name is required", { theme: "dark" });
    return;
  }

  setLoading(true);
  try {
    if (isEditMode && existingDay) {
      const updatePayload: ProgramDayUpdateModel = {
        name,
        description,
        notes,
        position: nextPosition,
      };
      await updateDay(existingDay.id, updatePayload);
      toast.success("Program day updated!", { theme: "dark" });
    } else {
      const createPayload: ProgramDayCreateModel = {
        trainingProgramId,
        name,
        position: nextPosition,
        description,
        notes,
      };
      await createDay(createPayload);
      toast.success("Program day created!", { theme: "dark" });
    }

    if (refresh) await refresh();
    onClose();
  } catch (err) {
    console.error(err);
    toast.error("Failed to save program day", { theme: "dark" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-bg2 p-6 rounded-xl w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4 text-text1">
          {isEditMode ? "Edit Program Day" : "Add Program Day"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-text1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md bg-bg3 text-text1 focus:outline-none focus:ring-2 focus:ring-button1"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-text1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-bg3 text-text1 focus:outline-none focus:ring-2 focus:ring-button1"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-text1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 rounded-md bg-bg3 text-text1 focus:outline-none focus:ring-2 focus:ring-button1"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-bg4 hover:bg-bg3 text-text1 px-4 py-2 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-button1 hover:bg-button2 text-text1 px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create Day"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgramDayModal;
