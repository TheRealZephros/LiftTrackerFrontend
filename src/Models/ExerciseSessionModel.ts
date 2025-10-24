export type ExerciseSessionModel = {
  id: number,
  exerciseId: number,
  userId: string,
  createdAt: string,
  sets: Array<ExerciseSetModel>,
  notes: string
}


export type ExerciseSetModel = {
  id: number,
  exerciseId: number,
  exerciseSessionId: number,
  repetitions: number,
  weight: number
}

export type ExerciseSessionCreateModel = {
  exerciseId: number,
  notes: string
}

export type ExerciseSessionCreateResponseModel = {
  id: 3,
  exerciseId: 5,
  userId: string,
  createdAt: string,
  sets: ExerciseSetModel[],
  notes: string
}


export type ExerciseSetCreateModel = {
  exerciseSessionId: number,
  repetitions: number,
  weight: number
}

export type ExerciseSetCreateResponseModel = {
  id: number,
  exerciseId: number,
  exerciseSessionId: number,
  repetitions: number,
  weight: number
}

export type ExerciseSessionUpdateModel = {
  exerciseId: number,
  notes: string
}

export type ExerciseSetUpdateModel = {
  repetitions: number,
  weight: number
}
