import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { ExerciseCreateModel, ExerciseModel } from "../../../Models/ExerciseModel";
import { useExerciseService } from "../../../Services/ExerciseService";

interface CreateExerciseModalProps {
  onClose: () => void;
  existingExercise?: ExerciseModel;
  refresh?: () => Promise<void>; // optional to refresh parent list
}

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  onClose,
  existingExercise,
  refresh,
}) => {
  const isEditMode = !!existingExercise;

  const [name, setName] = useState(existingExercise?.name || "");
  const [description, setDescription] = useState(existingExercise?.description || "");
  const [loading, setLoading] = useState(false);

  const { create: createExercise, update: updateExercise } = useExerciseService();

  useEffect(() => {
    if (existingExercise) {
      setName(existingExercise.name);
      setDescription(existingExercise.description);
    }
  }, [existingExercise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const payload: ExerciseCreateModel = { name, description };
      if (isEditMode) {
        await updateExercise(existingExercise!.id, payload);
        toast.success("Exercise updated!", { theme: "dark" });
      } else {
        await createExercise(payload);
        toast.success("Exercise created!", { theme: "dark" });
      }
      if (refresh) await refresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save exercise", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-bg2 rounded-xl p-6 w-full max-w-md shadow-lg relative overflow-y-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text3 hover:text-text1"
        >
          {FiX({ size: 20 })}
        </button>

        <h2 className="text-xl font-semibold text-text1 mb-4">
          {isEditMode ? "Edit Exercise" : "Create New Exercise"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text3 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg3 text-text1 p-2 rounded-md focus:ring-2 focus:ring-primary1"
              placeholder="e.g., Bench Press"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text3 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-bg3 text-text1 p-2 rounded-md focus:ring-2 focus:ring-primary1"
              placeholder="Describe the exercise..."
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
              {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create Exercise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExerciseModal;
