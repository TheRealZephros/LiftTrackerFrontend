import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { ExerciseSessionCreateModel, ExerciseSessionCreateResponseModel, ExerciseSessionModel, ExerciseSetCreateModel, ExerciseSetCreateResponseModel, ExerciseSetUpdateModel } from "../Models/ExerciseSessionModel";

const api = "https://localhost:7080/api/sessions/";

export const getAllExerciseSessions = async (): Promise<ExerciseSessionModel[]> => {
    try {
        const { data } = await axios.get<ExerciseSessionModel[]>(api);
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching exercise sessions:", error);
        throw error;
    }
};

export const getExerciseSessionById = async (sessionId: string): Promise<ExerciseSessionModel> => {
    try {
        const { data } = await axios.get<ExerciseSessionModel>(api + `${sessionId}`);
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching exercise session:", error);
        throw error;
    }
};

export const getSetsBySessionId = async (sessionId: string): Promise<ExerciseSessionModel[]> => {
    try {
        const { data } = await axios.get<ExerciseSessionModel[]>(api + `${sessionId}/sets`);
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching sets for exercise session:", error);
        throw error;
    }
};

export const getSetsById = async (setId: string): Promise<ExerciseSessionModel> => {
    try {
        const { data } = await axios.get<ExerciseSessionModel>(api + `sets/${setId}`);
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching set:", error);
        throw error;
    }
};

export const createExerciseSession = async (session: ExerciseSessionCreateModel): Promise<ExerciseSessionCreateResponseModel> => {
    try {
        const { data } = await axios.post<ExerciseSessionCreateResponseModel>(api + `create`, session);
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error creating exercise session:", error);
        throw error;
    }
};

export const createExerciseSet = async (set: ExerciseSetCreateModel): Promise<ExerciseSetCreateResponseModel> => {
    try {
        const { data } = await axios.post<ExerciseSetCreateResponseModel>(api + `sets/create`, set);
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error creating exercise set:", error);
        throw error;
    }
};

export const updateExerciseSession = async (sessionId: number, updatedSession: ExerciseSessionCreateModel): Promise<void> => {
    try {
        await axios.put(api + `update/${sessionId}`, updatedSession);
    } catch (error) {
        handleError(error);
        console.error("Error updating exercise session:", error);
        throw error;
    }
};

export const updateExerciseSet = async (setId: number, updatedSet: ExerciseSetUpdateModel): Promise<void> => {
    try {
        await axios.put(api + `sets/update/${setId}`, updatedSet);
    } catch (error) {
        handleError(error);
        console.error("Error updating exercise set:", error);
        throw error;
    }
};

export const deleteExerciseSession = async (sessionId: number): Promise<void> => {
    try {
        await axios.delete(api + `delete/${sessionId}`);
    } catch (error) {
        handleError(error);
        console.error("Error deleting exercise session:", error);
        throw error;
    }
};

export const deleteExerciseSet = async (setId: number): Promise<void> => {
    try {
        await axios.delete(api + `sets/delete/${setId}`);
    } catch (error) {
        handleError(error);
        console.error("Error deleting exercise set:", error);
        throw error;
    }
};
