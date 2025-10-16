export type TrainingProgramModel = {
  id: number,
  userId: string,
  name: string,
  description: string,
  isWeekDaySynced: boolean,
  createdAt: string,
  days: ProgramDayModel[]
}

export type ProgramDayModel = {
    id: number,
    trainingProgramId: number,
    position: number,
    description: string,
    notes: string,
    name: string,
    exercises: ProgrammedExerciseModel[]
}

export type ProgrammedExerciseModel = {
  id: number,
  programDayId: number,
  exerciseId: number,
  position: number,
  sets: number,
  reps: number,
  restTime: number,
  notes: string
}

export type ExerciseModel = {
  id: number,
  name: string,
  description: string,
  isUsermade: boolean,
  userId: string
}

export type ExerciseSessionModel = {
  id: number,
  exerciseId: number,
  userId: string,
  createdAt: string,
  sets: Array<ExerciseSetModel>
}

export type ExerciseSetModel = {
  id: number,
  exerciseId: number,
  exerciseSessionId: number,
  repetitions: number,
  weight: number
}
