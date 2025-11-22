import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

const api = "https://localhost:7080/api/user/";

// Login
export const loginAPI = async (email: string, password: string): Promise<UserProfileToken> => {
    try {
        const { data } = await axios.post<UserProfileToken>(api + "login", {
            email,
            password,
        });
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error during login:", error);
        throw error;
    }
};

// Register
export const registerAPI = async (email: string, userName: string, password: string): Promise<UserProfileToken> => {
    try {
        const { data } = await axios.post<UserProfileToken>(api + "register", {
            email,
            userName,
            password,
        });
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error during registration:", error);
        throw error;
    }
};

// Refresh token
export const refreshTokenAPI = async (refreshToken: string): Promise<UserProfileToken> => {
    try {
        const { data } = await axios.post<UserProfileToken>(api + "refresh", { refreshToken });
        return data;
    } catch (error) {
        handleError(error);
        console.error("Error refreshing token:", error);
        throw error;
    }
};
