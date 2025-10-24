import React, { useEffect, useState } from "react";
import { getAllExerciseSessions, deleteExerciseSession } from "../../Services/ExerciseSessionService";
import { getAllExercises } from "../../Services/ExerciseService";
import { ExerciseSessionModel } from "../../Models/ExerciseSessionModel";
import { ExerciseModel } from "../../Models/ExerciseModel";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner/Spinner";
import { groupSessionsByDay } from "../../Helpers/GroupSessionsByDay";
import ExerciseSessionModal from "../../Components/Modals/ExerciseSessionModal/ExerciseSessionModal";
import { FiPlus } from "react-icons/fi";

const SessionPage = () => {
  const [sessions, setSessions] = useState<ExerciseSessionModel[]>([]);
  const [exercises, setExercises] = useState<Record<number, ExerciseModel>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch sessions and exercises
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const [sessionsData, exercisesData] = await Promise.all([
        getAllExerciseSessions(),
        getAllExercises(),
      ]);

      // Map exercises by id for quick lookup
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

  useEffect(() => { fetchSessions(); }, []);

  const grouped = groupSessionsByDay(sessions);

  const handleDeleteSession = async (id: number) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await deleteExerciseSession(id);
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
        <h2 className="text-2xl font-semibold text-white">Exercise Sessions</h2>
        <button
          onClick={() => { setSelectedDay(null); setShowModal(true); }}
          className="p-1 text-yellow-400 hover:text-yellow-500 transition"
          title="Add new session"
        >
          {FiPlus({ size: 18 })}
        </button>
      </div>

      {Object.keys(grouped).length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(grouped).map(([day, daySessions]) => {
            // Unique exercise names
            const uniqueExerciseNames = Array.from(
              new Set(daySessions.map(s => exercises[s.exerciseId]?.name || s.exerciseId))
            );

            return (
              <div
                key={day}
                className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700 hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                onClick={() => { setSelectedDay(day); setShowModal(true); }}
              >
                <h3 className="text-lg font-semibold text-yellow-400">
                  {new Date(day).toLocaleDateString()}
                </h3>
                <ul className="mt-2 text-gray-300 text-sm">
                  {uniqueExerciseNames.map((name, idx) => (
                    <li key={idx} className="truncate">{name}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 italic text-center mt-8">No sessions available.</p>
      )}

      {showModal && selectedDay !== null && (
        <ExerciseSessionModal
          day={selectedDay}
          sessions={sessions.filter(s => s.createdAt.startsWith(selectedDay))}
          exercises={exercises}
          onClose={() => setShowModal(false)}
          refresh={fetchSessions}
        />
      )}

      {showModal && selectedDay === null && (
        <ExerciseSessionModal
          exercises={exercises}
          onClose={() => setShowModal(false)}
          refresh={fetchSessions}
        />
      )}
    </div>
  );
};

export default SessionPage;
