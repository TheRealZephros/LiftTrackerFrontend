import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createTrainingProgram,
  getAllTrainingPrograms,
  getTrainingProgramById,
  deleteTrainingProgram,
  updateTrainingProgram,
} from "../../Services/TrainingProgramService";
import { TrainingProgramAllModel, TrainingProgramUpdateModel } from "../../Models/TrainingProgram";
import Spinner from "../../Components/Spinner/Spinner";
import ProgramCardList from "../../Components/CardList/CardList";
import CreateProgramModal from "../../Components/Modals/CreateProgramModal/CreateProgramModal";

const TrainingProgramOverviewPage = () => {
  const [programs, setPrograms] = useState<TrainingProgramAllModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<(TrainingProgramUpdateModel & { id: number }) | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getAllTrainingPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Error loading programs:", error);
        toast.error("Failed to load programs", { theme: "dark" });
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Create new program
  const handleCreateProgram = async (newProgram: TrainingProgramUpdateModel) => {
    try {
      const created = await createTrainingProgram(newProgram);
      setPrograms((prev) => [...prev, created]);
      setShowModal(false);
      toast.success("Program created successfully!", { theme: "dark" });
    } catch (error) {
      console.error("Error creating program:", error);
      toast.error("Failed to create program!", { theme: "dark" });
    }
  };

  // Delete program
  const handleDeleteProgram = async (id: number) => {
    try {
      await deleteTrainingProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      toast.success("Program deleted successfully!", { theme: "dark" });
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Failed to delete program!", { theme: "dark" });
    }
  };

  // Fetch full program and open modal for editing
  const handleEditProgram = async (id: number) => {
  try {
    const program = await getTrainingProgramById(id.toString()); // now program is an object, not array
    if (!program) {
      toast.error("Program not found for editing", { theme: "dark" });
      return;
    }

    setProgramToEdit({
      id: program.id,
      name: program.name,
      description: program.description,
      isWeekDaySynced: program.isWeekDaySynced,
    });
    setShowModal(true);
  } catch (error) {
    console.error("Error fetching program for edit:", error);
    toast.error("Failed to fetch program for editing", { theme: "dark" });
  }
};

  // Update program after editing
  const handleUpdateProgram = async (id: number, updatedData: TrainingProgramUpdateModel) => {
    try {
      await updateTrainingProgram(id, updatedData);
      setPrograms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
      );
      toast.success("Program updated successfully!", { theme: "dark" });
      setProgramToEdit(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating program:", error);
      toast.error("Failed to update program!", { theme: "dark" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative">
      <ToastContainer />

      <h1 className="text-3xl font-bold mt-8 mb-4">Training Programs</h1>

      <button
        onClick={() => {
          setProgramToEdit(null);
          setShowModal(true);
        }}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md mb-6"
      >
        + Create New Program
      </button>

      <ProgramCardList
        programs={programs}
        onDelete={handleDeleteProgram}
        onEdit={handleEditProgram}
      />

      {showModal && (
        <CreateProgramModal
          onClose={() => {
            setShowModal(false);
            setProgramToEdit(null);
          }}
          onCreate={(data) => {
            if (programToEdit) {
              handleUpdateProgram(programToEdit.id, data);
            } else {
              handleCreateProgram(data);
            }
          }}
          program={programToEdit ?? undefined}
        />
      )}
    </div>
  );
};

export default TrainingProgramOverviewPage;
