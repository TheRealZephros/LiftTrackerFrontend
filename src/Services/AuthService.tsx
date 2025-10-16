import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

const api = "https://localhost:7080/api/";

export const loginAPI = async (email: string, password: string) => {
    try{
        const data = await axios.post<UserProfileToken>(api + "user/login", {
            email: email,
            password: password
        });
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error during login:", error);
        throw error;
    }
};

export const registerAPI = async (email: string, userName: string, password: string) => {
    try{
        const data = await axios.post<UserProfileToken>(api + "user/register", {
            email: email,
            userName: userName,
            password: password
        });
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error during registration:", error);
        throw error;
    }
};