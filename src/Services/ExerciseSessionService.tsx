import { useAxiosClient } from "../Api/AxiosClient";
import { 
    ExerciseSessionCreateModel,
    ExerciseSessionCreateResponseModel,
    ExerciseSessionModel,
    ExerciseSetCreateModel,
    ExerciseSetCreateResponseModel,
    ExerciseSetUpdateModel
} from "../Models/ExerciseSessionModel";

export const useExerciseSessionService = () => {
    const api = useAxiosClient();
    const base = "/sessions/";

    return {

        getAll: async (): Promise<ExerciseSessionModel[]> => {
            const { data } = await api.get(base);
            return data;
        },

        getById: async (sessionId: number): Promise<ExerciseSessionModel> => {
            const { data } = await api.get(base + sessionId);
            return data;
        },

        getByExerciseId: async (exerciseId: number): Promise<ExerciseSessionModel[]> => {
            const { data } = await api.get(base + `exercise/${exerciseId}`);
            return data;
        },

        getSetsBySessionId: async (sessionId: number) => {
            const { data } = await api.get(base + `${sessionId}/sets`);
            return data;
        },

        getSetById: async (setId: number) => {
            const { data } = await api.get(base + `sets/${setId}`);
            return data;
        },

        createSession: async (session: ExerciseSessionCreateModel): 
            Promise<ExerciseSessionCreateResponseModel> => 
        {
            const { data } = await api.post(base + "create", session);
            return data;
        },

        createSet: async (set: ExerciseSetCreateModel): 
            Promise<ExerciseSetCreateResponseModel> => 
        {
            const { data } = await api.post(base + "sets/create", set);
            return data;
        },

        updateSession: async (sessionId: number, updated: ExerciseSessionCreateModel) => {
            await api.put(base + `update/${sessionId}`, updated);
        },

        updateSet: async (setId: number, updated: ExerciseSetUpdateModel) => {
            await api.put(base + `sets/update/${setId}`, updated);
        },

        deleteSession: async (sessionId: number) => {
            await api.delete(base + `delete/${sessionId}`);
        },

        deleteSet: async (setId: number) => {
            await api.delete(base + `sets/delete/${setId}`);
        }
    };
};
