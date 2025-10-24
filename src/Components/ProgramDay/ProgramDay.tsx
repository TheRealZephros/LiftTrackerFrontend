import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import {
  ProgramDayModel,
  ProgrammedExerciseModel,
  ProgrammedExerciseCreateModel,
} from "../../Models/TrainingProgram";
import { programmedExerciseConfig } from "../../Configs/ProgrammedExerciseConfig";
import {
  getProgramDayById,
  createProgrammedExercise,
  deleteProgrammedExercise,
  updateProgrammedExercise,
} from "../../Services/TrainingProgramService";
import { getExerciseById } from "../../Services/ExerciseService";
import Table from "../Table/Table";
import { toast } from "react-toastify";
import CreateProgrammedExerciseModal from "../Modals/CreateProgrammedExerciseModal/CreateProgrammedExerciseModal";
import { ExerciseModel } from "../../Models/ExerciseModel";
import { FiEdit, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

interface EnrichedExercise extends ProgrammedExerciseModel {
  exercise: ExerciseModel;
}

const ProgramDay = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const [dayData, setDayData] = useState<ProgramDayModel>();
  const [enrichedExercises, setEnrichedExercises] = useState<EnrichedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<EnrichedExercise | null>(null);

  const fetchDayAndExercises = async () => {
    if (!dayId) return;
    setLoading(true);
    try {
      const day = await getProgramDayById(dayId);
      setDayData(day);

      const exercises = await Promise.all(
        day.exercises.map(async (pe) => {
          const exercise = await getExerciseById(pe.exerciseId);
          return { ...pe, exercise };
        })
      );
      setEnrichedExercises(exercises);
    } catch (error) {
      console.error("Error fetching day or exercises:", error);
      toast.error("Failed to load program day", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayAndExercises();
  }, [dayId]);

  const handleAddExercise = async (newExercise: ProgrammedExerciseCreateModel) => {
    try {
      const created = await createProgrammedExercise(newExercise);
      const exercise = await getExerciseById(created.exerciseId);
      setEnrichedExercises((prev) => [...prev, { ...created, exercise }]);
      toast.success("Exercise added successfully!", { theme: "dark" });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast.error("Failed to add exercise", { theme: "dark" });
    }
  };

  const handleEditExercise = (exercise: EnrichedExercise) => {
    setExerciseToEdit(exercise);
    setShowEditModal(true);
  };

  const handleUpdateExercise = async (updatedData: ProgrammedExerciseCreateModel) => {
    if (!exerciseToEdit) return;

    try {
      await updateProgrammedExercise(exerciseToEdit.id, updatedData);
      const updatedExercise = await getExerciseById(updatedData.exerciseId);

      setEnrichedExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseToEdit.id
            ? { ...ex, ...updatedData, exercise: updatedExercise }
            : ex
        )
      );

      toast.success("Exercise updated successfully!", { theme: "dark" });
      setShowEditModal(false);
      setExerciseToEdit(null);
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error("Failed to update exercise", { theme: "dark" });
    }
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;

    try {
      await deleteProgrammedExercise(exerciseId);
      setEnrichedExercises((prev) => prev.filter((e) => e.id !== exerciseId));
      toast.success("Exercise deleted!", { theme: "dark" });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Failed to delete exercise", { theme: "dark" });
    }
  };

  if (loading) return <Spinner />;

  if (!dayData) {
    return <p className="text-gray-400 italic text-center mt-4">No data found.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">{dayData.name}</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1 text-yellow-400 hover:text-yellow-500 transition"
          title="Add new exercise"
        >
          {FiPlus({ size: 18 })}
        </button>
      </div>

      <p className="text-gray-300">{dayData.description}</p>

      {enrichedExercises.length > 0 ? (
        <Table
          key={enrichedExercises.map((ex) => ex.id).join(",")}
          config={[
            ...programmedExerciseConfig,
            {
              label: "Actions",
              render: (row: EnrichedExercise) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditExercise(row)}
                    className="p-1 text-blue-400 hover:text-blue-500 transition"
                    title="Edit Exercise"
                  >
                    {FiEdit2({ size: 18 })}
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(row.id)}
                    className="p-1 text-red-400 hover:text-red-500 transition"
                    title="Delete Exercise"
                  >
                    {FiTrash2({ size: 18 })}
                  </button>
                </div>
              ),
            },
          ]}
          data={enrichedExercises}
        />
      ) : (
        <p className="text-gray-400 italic text-center mt-4">
          No exercises found for this day.
        </p>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateProgrammedExerciseModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleAddExercise}
          programDayId={Number(dayId)}
          nextPosition={enrichedExercises.length + 1}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && exerciseToEdit && (
        <CreateProgrammedExerciseModal
          onClose={() => {
            setShowEditModal(false);
            setExerciseToEdit(null);
          }}
          onCreate={handleUpdateExercise}
          programDayId={Number(dayId)}
          nextPosition={exerciseToEdit.position}
          existingExercise={exerciseToEdit}
        />
      )}

    </div>
  );
};

export default ProgramDay;
