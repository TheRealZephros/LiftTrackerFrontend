import { ExerciseSessionModel } from "../Models/ExerciseSessionModel";

export const groupSessionsByDay = (sessions: ExerciseSessionModel[]) => {
  const grouped: Record<string, ExerciseSessionModel[]> = {};
  
  sessions.forEach(session => {
    const day = session.createdAt.slice(0, 10); // YYYY-MM-DD
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(session);
  });

  return grouped;
};
