import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { TrainingProgramModel, ProgramDayModel, ProgrammedExerciseModel, TrainingProgramAllModel, TrainingProgramUpdateModel, ProgramDayCreateModel, ProgramDayUpdateModel, ProgrammedExerciseCreateModel } from "../Models/TrainingProgram";

const api = "https://localhost:7080/api/programs/";

export const getAllTrainingPrograms = async (): Promise<TrainingProgramAllModel[]> => {
    try {
        const data = await axios.get<TrainingProgramAllModel[]>(api);
        return data.data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching training programs:", error);
        throw error;
    }
};

export const getTrainingProgramById = async (programId: string): Promise<TrainingProgramModel> => {
    try {
        const { data } = await axios.get<TrainingProgramModel>(api + `${programId}`);
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching training programs:", error);
        throw error;
    }
};

export const getProgramDaysByProgramId = async (programId: string): Promise<ProgramDayModel[]> => {
    try {
        const data = await axios.get<ProgramDayModel[]>(api + `days/program/${programId}`);
        return data.data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching program days:", error);
        throw error;
    }
};

export const getProgramDayById = async (dayId: string): Promise<ProgramDayModel> => {
    try {
        const data = await axios.get<ProgramDayModel>(api + `days/${dayId}`);
        return data.data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching program day:", error);
        throw error;
    }
};

export const getProgrammedExercisesByDayId = async (dayId: string): Promise<ProgrammedExerciseModel[]> => {
    try {
        const data = await axios.get<ProgrammedExerciseModel[]>(api + `days/${dayId}/exercises`);
        return data.data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching programmed exercises:", error);
        throw error;
    }
};

export const getProgrammedExerciseById = async (exerciseId: string): Promise<ProgrammedExerciseModel> => {
    try {
        const data = await axios.get<ProgrammedExerciseModel>(api + `exercises/${exerciseId}`);
        return data.data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching programmed exercise:", error);
        throw error;
    }
};

export const createTrainingProgram = async (program: {
  name: string;
  description: string;
  isWeekDaySynced: boolean;
}) => {
  try {
    const response = await axios.post(api + "create", program);
    return response.data;
  } catch (error) {
    handleError(error);
    console.error("Error creating training program:", error);
    throw error;
  }
};

export const createProgramDay = async (day: ProgramDayCreateModel) => {
  try {
    const response = await axios.post(api + `days/create`, day);
    return response.data;
  } catch (error) {
    handleError(error);
    console.error("Error creating program day:", error);
    throw error;
  }
};

export const createProgrammedExercise = async (exercise: ProgrammedExerciseCreateModel ) => {
    try {
        const response = await axios.post(api + `exercises/create`, exercise);
        return response.data;
    } catch (error) {
        handleError(error);
        console.error("Error creating programmed exercise:", error);
        throw error;
    }
};

export const updateTrainingProgram = async (programId: number, updatedProgram: TrainingProgramUpdateModel): Promise<void> => {
  try {
    await axios.put(api + `update/${programId}`, updatedProgram);
  } catch (error) {
    handleError(error);
    console.error("Error updating training program:", error);
    throw error;
  }
};

export const updateProgramDay = async (dayId: number, updatedDay: ProgramDayUpdateModel): Promise<void> => {
  try {
    await axios.put(api + `update/days/${dayId}`, updatedDay);
  } catch (error) {
    handleError(error);
    console.error("Error updating program day:", error);
    throw error;
  }
};

export const updateProgrammedExercise = async (exerciseId: number, updatedExercise: ProgrammedExerciseCreateModel): Promise<void> => {
    try {
        await axios.put(api + `update/exercises/${exerciseId}`, updatedExercise);
    } catch (error) {
        handleError(error);
        console.error("Error updating programmed exercise:", error);
        throw error;
    }
};

export const deleteTrainingProgram = async (programId: number): Promise<void> => {
    try {
        await axios.delete(api + `delete/${programId}`);
    } catch (error) {
        handleError(error);
        console.error("Error deleting training program:", error);
        throw error;
    }
};

export const deleteProgramDay = async (dayId: number): Promise<void> => {
  try {
    await axios.delete(api + `delete/days/${dayId}`);
  } catch (error) {
    handleError(error);
    console.error("Error deleting program day:", error);
    throw error;
  }
};

export const deleteProgrammedExercise = async (exerciseId: number): Promise<void> => {
    try {
        await axios.delete(api + `delete/exercises/${exerciseId}`);
    } catch (error) {
        handleError(error);
        console.error("Error deleting programmed exercise:", error);
        throw error;
    }
};
