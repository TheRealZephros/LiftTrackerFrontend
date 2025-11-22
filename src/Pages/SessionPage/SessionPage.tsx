import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import Spinner from "../../Components/Spinner/Spinner";
import ExerciseSessionModal from "../../Components/Modals/ExerciseSessionModal/ExerciseSessionModal";
import CreateSessionModal from "../../Components/Modals/CreateSessionModal/CreateSessionModal";
import NestedSetsModal from "../../Components/Modals/CreateSessionModal/NestedSetsModal";
import { groupSessionsByDay } from "../../Helpers/GroupSessionsByDay";

import { useExerciseService } from "../../Services/ExerciseService";
import { useExerciseSessionService } from "../../Services/ExerciseSessionService";

import { ExerciseSessionModel } from "../../Models/ExerciseSessionModel";
import { ExerciseModel } from "../../Models/ExerciseModel";

const SessionPage: React.FC = () => {
  const [sessions, setSessions] = useState<ExerciseSessionModel[]>([]);
  const [exercises, setExercises] = useState<Record<number, ExerciseModel>>({});
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nestedSetsSession, setNestedSetsSession] = useState<ExerciseSessionModel | null>(null);

  const sessionService = useExerciseSessionService();
  const exerciseService = useExerciseService();

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const [sessionsData, exercisesData] = await Promise.all([
        sessionService.getAll(),
        exerciseService.getAll(),
      ]);

      const exercisesMap: Record<number, ExerciseModel> = {};
      exercisesData.forEach((ex) => (exercisesMap[ex.id] = ex));

      setSessions(sessionsData);
      setExercises(exercisesMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sessions or exercises", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const grouped = groupSessionsByDay(sessions);

  const handleDeleteSession = async (id: number) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await sessionService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success("Session deleted!", { theme: "dark" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete session", { theme: "dark" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-start gap-4">
        <h2 className="text-2xl font-semibold text-text1">Exercise Sessions</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1 text-button1 hover:text-button2 transition"
          title="Add new session"
        >
          {FiPlus({ size: 18 })}
        </button>
      </div>

      {Object.keys(grouped).length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(grouped).map(([day, daySessions]) => {
            const uniqueExerciseNames = Array.from(
              new Set(daySessions.map(s => exercises[s.exerciseId]?.name || s.exerciseId))
            );

            return (
              <div
                key={day}
                className="bg-bg2 rounded-lg p-4 shadow-md border border-bg3 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                onClick={() => { setSelectedDay(day); setShowExerciseModal(true); }}
              >
                <h3 className="text-lg font-semibold text-text2">{new Date(day).toLocaleDateString()}</h3>
                <ul className="mt-2 text-text3 text-sm">
                  {uniqueExerciseNames.map((name, idx) => (
                    <li key={idx} className="truncate">{name}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-text3 italic text-center mt-8">No sessions available.</p>
      )}

      {showExerciseModal && selectedDay && (
        <ExerciseSessionModal
          day={selectedDay}
          sessions={sessions.filter(s => s.createdAt.startsWith(selectedDay))}
          exercises={exercises}
          onClose={() => setShowExerciseModal(false)}
          refresh={fetchSessions}
          onOpenSets={setNestedSetsSession}
        />
      )}

      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          refresh={fetchSessions}
          exercises={Object.values(exercises)}
          onOpenSets={setNestedSetsSession}
        />
      )}

      {nestedSetsSession && (
        <NestedSetsModal
          session={nestedSetsSession}
          onClose={() => setNestedSetsSession(null)}
          refresh={fetchSessions}
        />
      )}
    </div>
  );
};

export default SessionPage;
