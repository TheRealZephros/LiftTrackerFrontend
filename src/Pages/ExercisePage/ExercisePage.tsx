import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExerciseById } from "../../Services/ExerciseService";
import { getSessionsByExerciseId } from "../../Services/ExerciseSessionService";
import { ExerciseModel } from "../../Models/ExerciseModel";
import { ExerciseSessionModel } from "../../Models/ExerciseSessionModel";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner/Spinner";
import {
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ExercisePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<ExerciseModel | null>(null);
  const [sessions, setSessions] = useState<ExerciseSessionModel[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Toggle states
  const [showWeight, setShowWeight] = useState(true);
  const [showReps, setShowReps] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!exerciseId) {
        setLoading(false);
        return;
      }

      try {
        const [exerciseData, sessionData] = await Promise.all([
          getExerciseById(Number(exerciseId)),
          getSessionsByExerciseId(Number(exerciseId)),
        ]);

        setExercise(exerciseData);
        setSessions(sessionData);

        // Transform data for chart
        const byDate: Record<string, { weights: number[]; reps: number[] }> = {};
        sessionData.forEach((session) => {
          const date = session.createdAt.split("T")[0];
          const weights = session.sets.map((s) => s.weight).filter((w) => w != null);
          const reps = session.sets.map((s) => s.repetitions).filter((r) => r != null);

          if (!byDate[date]) byDate[date] = { weights: [], reps: [] };
          byDate[date].weights.push(...weights);
          byDate[date].reps.push(...reps);
        });

        const transformed = Object.entries(byDate)
          .map(([date, { weights, reps }]) => {
            if (weights.length === 0 && reps.length === 0) return null;

            return {
              date,
              minWeight: weights.length ? Math.min(...weights) : undefined,
              maxWeight: weights.length ? Math.max(...weights) : undefined,
              avgWeight: weights.length
                ? weights.reduce((a, b) => a + b, 0) / weights.length
                : undefined,
              avgReps: reps.length
                ? reps.reduce((a, b) => a + b, 0) / reps.length
                : undefined,
            };
          })
          .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

        setChartData(transformed.sort((a, b) => a.date.localeCompare(b.date)));
      } catch (err) {
        toast.error("Failed to load exercise or session data", { theme: "dark" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId]);

  if (loading) return <Spinner />;

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen bg-blueGray-100 text-gray-700">
        Exercise not found.
      </div>
    );
  }

  return (
    <div className="bg-blueGray-100 w-full flex flex-col items-center px-4 pt-24 pb-10">
      {/* Info Card */}
      <div className="bg-gray-800 text-yellow-500 rounded-2xl shadow-xl p-8 max-w-2xl w-full mb-10">
        <h1 className="text-4xl font-semibold mb-6 text-center">{exercise.name}</h1>
        <div className="space-y-3 text-gray-300">
          <p>
            <strong className="text-yellow-500">Name:</strong> {exercise.name || "N/A"}
          </p>
          <p>
            <strong className="text-yellow-500">Description:</strong>{" "}
            {exercise.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowWeight((prev) => !prev)}
          className={`px-4 py-2 rounded-xl font-semibold ${
            showWeight ? "bg-yellow-500 text-black" : "bg-gray-700 text-yellow-500"
          }`}
        >
          Weight
        </button>
        <button
          onClick={() => setShowReps((prev) => !prev)}
          className={`px-4 py-2 rounded-xl font-semibold ${
            showReps ? "bg-red-500 text-black" : "bg-gray-700 text-red-500"
          }`}
        >
          Reps
        </button>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 ? (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-xl max-w-5xl w-full">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-4 text-center">
            Progress Over Time
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />

              {/* Left Y-axis for weight */}
              {showWeight && <YAxis stroke="#ffeb3b" />}

              {/* Right Y-axis for reps */}
              {showReps && <YAxis yAxisId="reps" orientation="right" stroke="#ff4d4d" />}

              <Tooltip
                contentStyle={{ backgroundColor: "#222", borderRadius: "8px" }}
                labelStyle={{ color: "#ffeb3b" }}
              />

              {/* Weight Areas/Line */}
              {showWeight && (
                <>
                  <Area
                    type="monotone"
                    dataKey="maxWeight"
                    stroke="#ffcc00"
                    fill="#ffcc00"
                    fillOpacity={0.2}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="minWeight"
                    stroke="#ffcc00"
                    fill="#ffcc00"
                    fillOpacity={0.05}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgWeight"
                    stroke="#ffeb3b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                </>
              )}

              {/* Reps Line */}
              {showReps && (
                <Line
                  yAxisId="reps"
                  type="monotone"
                  dataKey="avgReps"
                  stroke="#ff4d4d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-400 italic mt-6">
          No exercise session data available for this exercise yet.
        </p>
      )}
    </div>
  );
};

export default ExercisePage;
