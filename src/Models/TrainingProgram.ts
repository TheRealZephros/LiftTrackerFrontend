export type TrainingProgramAllModel = {
  id: number,
  name: string,
}

export type TrainingProgramCreateModel = {
  name: string,
  description: string,
  isWeekDaySynced: boolean
}

export type TrainingProgramDeleteModel = {
  id: number
}

export type TrainingProgramUpdateModel = {
  name: string,
  description: string,
  isWeekDaySynced: boolean
}

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

export type ProgramDayCreateModel = {
  trainingProgramId: number,
  name: string,
  position: number,
  description: string,
  notes: string
}

export type ProgramDayUpdateModel = {
  name: string,
  position: number,
  description: string,
  notes: string
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



export type ProgrammedExerciseCreateModel = {
  programDayId: number,
  exerciseId: number,
  position: number,
  sets: number,
  reps: number,
  restTime: number,
  notes: string
}

export type ProgrammedExerciseUpdateModel = {
  position: number,
  sets: number,
  reps: number,
  restTime: number,
  notes: string
}
