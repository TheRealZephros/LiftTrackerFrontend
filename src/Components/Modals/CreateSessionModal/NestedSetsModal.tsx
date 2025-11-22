import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  ExerciseSessionModel,
  ExerciseSetCreateModel,
  ExerciseSetUpdateModel,
  ExerciseSetModel,
} from "../../../Models/ExerciseSessionModel";
import { useExerciseSessionService } from "../../../Services/ExerciseSessionService";

interface NestedSetsModalProps {
  session: ExerciseSessionModel;
  onClose: () => void;
  refresh: () => void;
}

const NestedSetsModal: React.FC<NestedSetsModalProps> = ({ session, onClose, refresh }) => {
  const [sets, setSets] = useState<ExerciseSetModel[]>([]);
  const [newSet, setNewSet] = useState<Partial<ExerciseSetCreateModel>>({
    repetitions: 0,
    weight: 0,
  });
  const [loading, setLoading] = useState(false);

  const service = useExerciseSessionService();

  const refreshLocalSets = async () => {
    setLoading(true);
    try {
      const updatedSession = await service.getById(session.id);
      setSets(updatedSession.sets || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sets", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLocalSets();
  }, [session.id]);

  const handleAddSet = async () => {
    if (!newSet.repetitions || !newSet.weight) return;
    try {
      await service.createSet({
        exerciseSessionId: session.id,
        repetitions: newSet.repetitions!,
        weight: newSet.weight!,
      });
      toast.success("Set added!", { theme: "dark" });
      setNewSet({ repetitions: 0, weight: 0 });
      await refreshLocalSets();
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add set", { theme: "dark" });
    }
  };

  const handleUpdateSet = async (setId: number, updated: ExerciseSetUpdateModel) => {
    try {
      await service.updateSet(setId, updated);
      await refreshLocalSets();
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update set", { theme: "dark" });
    }
  };

  const handleDeleteSet = async (setId: number) => {
    if (!window.confirm("Delete this set?")) return;
    try {
      await service.deleteSet(setId);
      await refreshLocalSets();
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete set", { theme: "dark" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddSet();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-bg2 text-text1 rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text3 hover:text-text1"
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Sets for Session #{session.id}
        </h2>

        {loading ? (
          <p className="text-text3 italic text-center">Loading sets...</p>
        ) : (
          <table className="w-full text-left border border-bg3 rounded-md">
            <thead>
              <tr className="border-b border-bg3">
                <th className="p-2">Reps</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((set) => (
                <tr key={set.id} className="border-b border-bg3">
                  <td className="p-2">
                    <input
                      type="number"
                      value={set.repetitions}
                      onChange={(e) =>
                        handleUpdateSet(set.id, {
                          repetitions: parseInt(e.target.value),
                          weight: set.weight,
                        })
                      }
                      className="w-20 bg-bg3 text-text1 p-1 rounded-md"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        handleUpdateSet(set.id, {
                          repetitions: set.repetitions,
                          weight: parseFloat(e.target.value),
                        })
                      }
                      className="w-20 bg-bg3 text-text1 p-1 rounded-md"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteSet(set.id)}
                      className="text-buttonDelete1 hover:text-buttonDelete2"
                    >
                      {FiTrash2({ size: 18 })}
                    </button>
                  </td>
                </tr>
              ))}

              <tr>
                <td className="p-2">
                  <input
                    type="number"
                    value={newSet.repetitions || ""}
                    onChange={(e) =>
                      setNewSet((prev) => ({
                        ...prev,
                        repetitions: parseInt(e.target.value),
                      }))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Reps"
                    className="w-20 bg-bg3 text-text1 p-1 rounded-md"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={newSet.weight || ""}
                    onChange={(e) =>
                      setNewSet((prev) => ({
                        ...prev,
                        weight: parseFloat(e.target.value),
                      }))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Weight"
                    className="w-20 bg-bg3 text-text1 p-1 rounded-md"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={handleAddSet}
                    className="text-button1 hover:text-button2 px-2 rounded-md"
                  >
                    {FiPlus({ size: 18 })}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default NestedSetsModal;
