import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../../Components/Sidebar/Sidebar";
import TrainingProgram from "../../Components/TrainingProgram/TrainingProgram";
import Tile from "../../Components/Tile/Tile";
import Spinner from "../../Components/Spinner/Spinner";

import { wrapIcon } from "../../Components/IconWrapper/IconWrapper";
import { FaHome } from "react-icons/fa";
import CreateProgramDayModal from "../../Components/Modals/CreateProgramDayModal/CreateProgramDayModal";

import { useTrainingProgramService } from "../../Services/TrainingProgramService";
import {
  TrainingProgramModel,
  ProgramDayModel,
  ProgramDayCreateModel,
} from "../../Models/TrainingProgram";

const HomeIcon = wrapIcon(FaHome);

const TrainingProgramPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();

  const [program, setProgram] = useState<TrainingProgramModel | null>(null);
  const [programDayList, setProgramDayList] = useState<ProgramDayModel[]>([]);
  const [daysList, setDaysList] = useState<
    { path: string; label: string; icon?: React.FC }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { getById, createDay, deleteDay } = useTrainingProgramService();

  // React 18 Strict Mode runs effects twice in dev — this prevents double call
  const hasFetchedRef = useRef(false);

  const fetchProgram = useCallback(async () => {
    if (!programId) return;

    setLoading(true);

    try {
      const programData = await getById(programId);
      setProgram(programData);
      setProgramDayList(programData.days || []);

      setDaysList(
        (programData.days || []).map((day: ProgramDayModel) => ({
          path: day.id.toString(),
          label: day.name,
          icon: HomeIcon,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load program", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  }, [programId, getById]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchProgram();
  }, [fetchProgram]);

  const handleCreateDay = async (dayData: ProgramDayCreateModel) => {
    if (!program) return;

    try {
      const createdDay = await createDay(dayData);

      setProgramDayList((prev) => [...prev, createdDay]);

      setDaysList((prev) => [
        ...prev,
        {
          path: createdDay.id.toString(),
          label: createdDay.name,
          icon: HomeIcon,
        },
      ]);

      toast.success("Day created successfully!", { theme: "dark" });
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create day", { theme: "dark" });
    }
  };

  const handleDeleteDay = async (dayId: number) => {
    if (!window.confirm("Are you sure you want to delete this day?")) return;

    try {
      await deleteDay(dayId);

      setProgramDayList((prev) => prev.filter((day) => day.id !== dayId));
      setDaysList((prev) => prev.filter((d) => d.path !== dayId.toString()));

      toast.success("Day deleted successfully!", { theme: "dark" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete day!", { theme: "dark" });
    }
  };

  if (loading) return <Spinner />;
  if (!program)
    return (
      <p className="text-center text-buttonDelete2 mt-8">Program not found</p>
    );

  return (
    <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
      <Sidebar
        elements={daysList}
        onAddDay={() => setShowModal(true)}
        onDeleteDay={handleDeleteDay}
      />

      {showModal && (
        <CreateProgramDayModal
          onClose={() => setShowModal(false)}
          trainingProgramId={program.id}
          nextPosition={programDayList.length + 1}
        />
      )}

      <TrainingProgram programId={programId!}>
        <Tile title={program.name} subTitle="" />

        <p className="bg-bg1 shadow rounded text-medium font-medium text-text1 p-3 mb-0 m-4 min-w-[100%]">
          Description:
        </p>

        <p className="bg-bg2 shadow rounded text-medium font-medium text-text1 p-3 mt-0 m-4 min-w-[100%]">
          {program.description}
        </p>
      </TrainingProgram>
    </div>
  );
};

export default TrainingProgramPage;
