import React, { useEffect, useState } from "react";
import { useExerciseService } from "../../Services/ExerciseService";
import { ExerciseModel, ExerciseCreateModel } from "../../Models/ExerciseModel";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Spinner from "../../Components/Spinner/Spinner";
import CreateExerciseModal from "../../Components/Modals/CreateExerciseModal/CreateExerciseModal";
import { Link } from "react-router-dom";

const ExerciseOverviewPage = () => {
  const { getAll, create, update, delete: remove } = useExerciseService();

  const [exercises, setExercises] = useState<ExerciseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] =
    useState<ExerciseModel | null>(null);

  // Fetch exercises
  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await getAll();
      setExercises(data);
    } catch (error) {
      console.error("Error loading exercises:", error);
      toast.error("Failed to load exercises", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // CREATE
  const handleCreate = async (exercise: ExerciseCreateModel) => {
    try {
      const createdResponse = await create(exercise);

      // backend returns { id: X }
      const newExercise: ExerciseModel = {
        ...exercise,
        id: createdResponse.id,
        isUsermade: true,
        userId: createdResponse.userId,
      };

      setExercises((prev) => [...prev, newExercise]);
      toast.success("Exercise created successfully!", { theme: "dark" });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error("Failed to create exercise", { theme: "dark" });
    }
  };

  // UPDATE
  const handleUpdate = async (exercise: ExerciseCreateModel) => {
    if (!exerciseToEdit) return;
    try {
      await update(exerciseToEdit.id, exercise);

      // merge local state manually because API returns void
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseToEdit.id ? { ...ex, ...exercise } : ex
        )
      );

      toast.success("Exercise updated successfully!", { theme: "dark" });
      setExerciseToEdit(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error("Failed to update exercise", { theme: "dark" });
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    try {
      await remove(id);
      setExercises((prev) => prev.filter((e) => e.id !== id));
      toast.success("Exercise deleted!", { theme: "dark" });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Failed to delete exercise", { theme: "dark" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-start gap-4">
        <h2 className="text-2xl font-semibold text-text1">Exercises</h2>
        <button
          onClick={() => {
            setExerciseToEdit(null);
            setShowModal(true);
          }}
          className="p-1 text-button1 hover:text-button2 transition"
          title="Add new exercise"
        >
          {FiPlus({ size: 18 })}
        </button>
      </div>

      {exercises.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-bg2 rounded-lg p-4 shadow-md border border-bg3 hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <Link
                  to={`/exercises/${exercise.id}`}
                  className="text-lg font-semibold text-text2 hover:underline font-medium"
                >
                  {exercise.name}
                </Link>
                <p className="text-text3 text-sm mt-2 line-clamp-3">
                  {exercise.description || "No description provided."}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    exercise.isUsermade
                      ? "bg-userMadeBg text-userMadeText"
                      : "bg-systemMadeBg text-systemMadeText"
                  }`}
                >
                  {exercise.isUsermade ? "User" : "System"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setExerciseToEdit(exercise);
                      setShowModal(true);
                    }}
                    className="p-1 text-buttonEdit1 hover:text-buttonEdit2 transition"
                    title="Edit Exercise"
                  >
                    {FiEdit2({ size: 18 })}
                  </button>

                  {exercise.isUsermade && (
                    <button
                      onClick={() => handleDelete(exercise.id)}
                      className="p-1 text-buttonDelete1 hover:text-buttonDelete2 transition"
                      title="Delete Exercise"
                    >
                      {FiTrash2({ size: 18 })}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text3 italic text-center mt-8">
          No exercises available.
        </p>
      )}

      {showModal && (
        <CreateExerciseModal
          onClose={() => {
            setShowModal(false);
            setExerciseToEdit(null);
          }}
          existingExercise={exerciseToEdit || undefined}
        />
      )}
    </div>
  );
};

export default ExerciseOverviewPage;
