import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { ExerciseCreatedResponseModel, ExerciseCreateModel, ExerciseModel, ExerciseUpdateModel } from "../Models/ExerciseModel";


const api = "https://localhost:7080/api/exercises/";

export const getAllExercises = async (): Promise<ExerciseModel[]> => {
  try {
    const { data } = await axios.get<ExerciseModel[]>(api);
    return data;
  } catch (error) {
    handleError(error);
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export const getExerciseById = async (id: number): Promise<ExerciseModel> => {
  try {
    const { data } = await axios.get<ExerciseModel>(api + `${id}`);
    return data;
  } catch (error) {
    handleError(error);
    console.error("Error fetching exercise:", error);
    throw error;
  }
};

export const createExercise = async (exercise: ExerciseCreateModel): Promise<ExerciseCreatedResponseModel> => {
  try {
    const { data } = await axios.post<ExerciseCreatedResponseModel>(api + "create", exercise);
    return data;
  } catch (error) {
    handleError(error);
    console.error("Error creating exercise:", error);
    throw error;
  }
};

export const updateExercise = async (id: number, exercise: ExerciseUpdateModel): Promise<void> => {
  try {
    await axios.put(api + `update/${id}`, exercise);
  } catch (error) {
    handleError(error);
    console.error("Error updating exercise:", error);
    throw error;
  }
};

export const deleteExercise = async (id: number): Promise<void> => {
  try {
    await axios.delete(api + `delete/${id}`);
  } catch (error) {
    handleError(error);
    console.error("Error deleting exercise:", error);
    throw error;
  }
};
