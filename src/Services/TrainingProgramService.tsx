import { useAxiosClient } from "../Api/AxiosClient";
import { 
    TrainingProgramModel,
    ProgramDayModel,
    ProgrammedExerciseModel,
    TrainingProgramAllModel,
    TrainingProgramUpdateModel,
    ProgramDayCreateModel,
    ProgramDayUpdateModel,
    ProgrammedExerciseCreateModel
} from "../Models/TrainingProgram";

export const useTrainingProgramService = () => {
    const api = useAxiosClient();
    const base = "/programs/";

    return {

        getAll: async (): Promise<TrainingProgramAllModel[]> => {
            const { data } = await api.get(base);
            return data;
        },

        getById: async (programId: string): Promise<TrainingProgramModel> => {
            const { data } = await api.get(base + programId);
            return data;
        },

        getDays: async (programId: string): Promise<ProgramDayModel[]> => {
            const { data } = await api.get(base + `days/program/${programId}`);
            return data;
        },

        getDayById: async (dayId: string): Promise<ProgramDayModel> => {
            const { data } = await api.get(base + `days/${dayId}`);
            return data;
        },

        getExercisesByDay: async (dayId: string): Promise<ProgrammedExerciseModel[]> => {
            const { data } = await api.get(base + `days/${dayId}/exercises`);
            return data;
        },

        getExerciseById: async (exerciseId: string): Promise<ProgrammedExerciseModel> => {
            const { data } = await api.get(base + `exercises/${exerciseId}`);
            return data;
        },

        createProgram: async (program: { 
            name: string; 
            description: string; 
            isWeekDaySynced: boolean; 
        }) => {
            const { data } = await api.post(base + "create", program);
            return data;
        },

        createDay: async (day: ProgramDayCreateModel) => {
            const { data } = await api.post(base + "days/create", day);
            return data;
        },

        createExercise: async (exercise: ProgrammedExerciseCreateModel) => {
            const { data } = await api.post(base + "exercises/create", exercise);
            return data;
        },

        updateProgram: async (programId: number, updated: TrainingProgramUpdateModel) => {
            await api.put(base + `update/${programId}`, updated);
        },

        updateDay: async (dayId: number, updated: ProgramDayUpdateModel) => {
            await api.put(base + `update/days/${dayId}`, updated);
        },

        updateExercise: async (exerciseId: number, updated: ProgrammedExerciseCreateModel) => {
            await api.put(base + `update/exercises/${exerciseId}`, updated);
        },

        deleteProgram: async (programId: number) => {
            await api.delete(base + `delete/${programId}`);
        },

        deleteDay: async (dayId: number) => {
            await api.delete(base + `delete/days/${dayId}`);
        },

        deleteExercise: async (exerciseId: number) => {
            await api.delete(base + `delete/exercises/${exerciseId}`);
        }
    };
};
