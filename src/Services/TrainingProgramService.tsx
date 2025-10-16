import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { TrainingProgramModel, ProgramDayModel, ProgrammedExerciseModel } from "../Models/TrainingProgram";

const api = "https://localhost:7080/api/";

export const getTrainingProgramById = async (programId: string): Promise<TrainingProgramModel[]> => {
    try {
        const data = await axios.get<TrainingProgramModel[]>(api + `program/${programId}`);
        return data.data;
    } catch (error) {
        handleError(error);
        console.error("Error fetching training programs:", error);
        throw error;
    }
};
