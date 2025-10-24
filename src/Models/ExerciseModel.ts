export type ExerciseModel = {
  id: number,
  name: string,
  description: string,
  isUsermade: boolean,
  userId: string
};

export type ExerciseCreateModel = {
  name: string,
  description: string
}

export type ExerciseUpdateModel = {
  name: string,
  description: string
}

export type ExerciseCreatedResponseModel = {
  id: 7,
  name: string,
  description: string,
  isUsermade: boolean,
  userId: string,
  user: string |null,
  createdAt: string
}
