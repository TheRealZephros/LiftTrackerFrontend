import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import RatioList from "../Components/RatioList/RatioList";
import { ProgrammedExerciseModel } from "../Models/TrainingProgram";
import HoverPortal from "../Components/HoverPortal/HoverPortal";
import { ExerciseModel } from "../Models/ExerciseModel";

export const programmedExerciseConfig = [
  {
    label: "Exercise",
    render: (exercise: ProgrammedExerciseModel & { exercise?: ExerciseModel }) => {
      if (!exercise.exercise) {
        return <span className="text-gray-400 italic">Unknown exercise</span>;
      }

      const hoverConfig = [
        { label: "Name", render: (e: ExerciseModel) => e.name },
        { label: "Description", render: (e: ExerciseModel) => e.description },
      ];

      const [isHovered, setIsHovered] = useState(false);
      const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
      const rafRef = useRef<number | null>(null);

      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => {
        setIsHovered(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };

      const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setPosition({
            x: e.clientX + 12,
            y: e.clientY + 12,
          });
        });
      };

      // Clean up RAF if unmounted
      useEffect(() => {
        return () => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
      }, []);

      return (
        <div className="relative inline-block">
          <Link
            to={`/exercises/${exercise.exercise.id}`}
            className="text-yellow-400 hover:underline font-medium"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {exercise.exercise.name}
          </Link>

          {isHovered && (
            <HoverPortal>
              <div
                style={{
                  position: "absolute",
                  left: position.x,
                  top: position.y,
                  zIndex: 9999,
                  pointerEvents: "none", // allows hover through
                }}
                className="
                  bg-gray-800 border border-gray-700 
                  text-gray-200 rounded-lg shadow-md 
                  p-4 w-max max-w-[90vw]
                  backdrop-blur-sm
                  transition-transform transform-gpu scale-100
                  hover:scale-[1.02]
                "
              >
                {/* Header (optional, if you want a title like “Details” or exercise name) */}
    

                {/* Table-like ratio list */}
                <RatioList config={hoverConfig} data={exercise.exercise} />
              </div>
            </HoverPortal>

          )}
        </div>
      );
    },
  },
  {
    label: "Sets",
    render: (exercise: ProgrammedExerciseModel) => exercise.sets,
  },
  {
    label: "Reps",
    render: (exercise: ProgrammedExerciseModel) => exercise.reps,
  },
  {
    label: "Rest (sec)",
    render: (exercise: ProgrammedExerciseModel) => `${exercise.restTime}s`,
  },
  {
    label: "Notes",
    render: (exercise: ProgrammedExerciseModel) =>
      exercise.notes || <span className="text-gray-400 italic">No notes</span>,
  },
];
