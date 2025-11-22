import { useAxiosClient } from "../Api/AxiosClient";
import { 
    ExerciseCreatedResponseModel,
    ExerciseCreateModel, 
    ExerciseModel, 
    ExerciseUpdateModel 
} from "../Models/ExerciseModel";

export const useExerciseService = () => {
    const api = useAxiosClient();
    const base = "/exercises/";

    return {

        getAll: async (): Promise<ExerciseModel[]> => {
            const { data } = await api.get(base);
            return data;
        },

        getById: async (id: number): Promise<ExerciseModel> => {
            const { data } = await api.get(base + id);
            return data;
        },

        create: async (exercise: ExerciseCreateModel): Promise<ExerciseCreatedResponseModel> => {
            const { data } = await api.post(base + "create", exercise);
            return data;
        },

        update: async (id: number, exercise: ExerciseUpdateModel): Promise<void> => {
            await api.put(base + `update/${id}`, exercise);
        },

        delete: async (id: number): Promise<void> => {
            await api.delete(base + `delete/${id}`);
        }
    };
};
