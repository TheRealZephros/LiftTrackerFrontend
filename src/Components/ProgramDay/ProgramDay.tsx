import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import { programmedExerciseConfig } from "../../Configs/ProgrammedExerciseConfig";
import Table from "../Table/Table";
import { toast } from "react-toastify";
import CreateProgrammedExerciseModal from "../Modals/CreateProgrammedExerciseModal/CreateProgrammedExerciseModal";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { useTrainingProgramService } from "../../Services/TrainingProgramService";
import { useExerciseService } from "../../Services/ExerciseService";

import {
  ProgramDayModel,
  ProgrammedExerciseModel,
  ProgrammedExerciseCreateModel,
} from "../../Models/TrainingProgram";
import { ExerciseModel } from "../../Models/ExerciseModel";

interface EnrichedExercise extends ProgrammedExerciseModel {
  exercise: ExerciseModel;
}

const ProgramDay: React.FC = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const [dayData, setDayData] = useState<ProgramDayModel>();
  const [enrichedExercises, setEnrichedExercises] = useState<EnrichedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<EnrichedExercise | null>(null);

  const {
    getDayById,
    getExercisesByDay,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useTrainingProgramService();
  const { getById: getExerciseById } = useExerciseService();

  const fetchProgramData = async () => {
    if (!dayId) return;
    setLoading(true);
    try {
      const day = await getDayById(dayId);
      setDayData(day);

      const exercises = await getExercisesByDay(dayId);
      const enriched = await Promise.all(
        exercises.map(async (pe) => ({
          ...pe,
          exercise: await getExerciseById(pe.exerciseId),
        }))
      );

      setEnrichedExercises(enriched);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load program day", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramData();
  }, [dayId]);

  const handleAddExercise = async (newExercise: ProgrammedExerciseCreateModel) => {
    try {
      const created = await createExercise(newExercise);
      const exercise = await getExerciseById(created.exerciseId);
      setEnrichedExercises((prev) => [...prev, { ...created, exercise }]);
      toast.success("Exercise added successfully!", { theme: "dark" });
      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add exercise", { theme: "dark" });
    }
  };

  const handleUpdateExercise = async (updatedData: ProgrammedExerciseCreateModel) => {
    if (!exerciseToEdit) return;
    try {
      await updateExercise(exerciseToEdit.id, updatedData);
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
      console.error(error);
      toast.error("Failed to update exercise", { theme: "dark" });
    }
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    try {
      await deleteExercise(exerciseId);
      setEnrichedExercises((prev) => prev.filter((e) => e.id !== exerciseId));
      toast.success("Exercise deleted!", { theme: "dark" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete exercise", { theme: "dark" });
    }
  };

  if (loading) return <Spinner />;
  if (!dayData)
    return <p className="text-text3 italic text-center mt-4">No data found.</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-text1">{dayData.name}</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1 text-button1 hover:text-button2 transition"
          title="Add new exercise"
        >
          {FiPlus({ size: 18 })}
        </button>
      </div>

      <p className="text-text3">{dayData.description}</p>

      {/* Exercise Table */}
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
                    onClick={() => {
                      setExerciseToEdit(row);
                      setShowEditModal(true);
                    }}
                    className="p-1 text-buttonEdit1 hover:text-buttonEdit2 transition"
                    title="Edit Exercise"
                  >
                    {FiEdit2({ size: 18 })}
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(row.id)}
                    className="p-1 text-buttonDelete1 hover:text-buttonDelete2 transition"
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
        <p className="text-text3 italic text-center mt-4">
          No exercises found for this day.
        </p>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateProgrammedExerciseModal
          onClose={() => setShowCreateModal(false)}
          refresh={fetchProgramData}
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
          refresh={fetchProgramData}
          programDayId={Number(dayId)}
          nextPosition={exerciseToEdit.position}
          existingExercise={exerciseToEdit}
        />
      )}
    </div>
  );
};

export default ProgramDay;
