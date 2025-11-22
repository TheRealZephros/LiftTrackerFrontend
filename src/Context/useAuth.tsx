// src/Context/useAuth.tsx
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAPI, registerAPI } from "../Services/AuthService";
import { UserProfile, UserProfileToken } from "../Models/User";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    refreshToken: string | null;
    saveTokens: (access: string, refresh: string) => void;
    registerUser: (email: string, userName: string, password: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoggedIn: () => boolean;
};

export const AuthContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
    const [user, setUser] = useState<UserProfile | null>(
        localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")!)
            : null
    );

    // --- Used by axiosClient to update tokens ---
    const saveTokens = (access: string, refresh: string) => {
        setToken(access);
        setRefreshToken(refresh);

        localStorage.setItem("token", access);
        localStorage.setItem("refreshToken", refresh);
    };

    // REGISTER
    const registerUser = async (email: string, userName: string, password: string) => {
        try {
            const res = await registerAPI(email, userName, password);
            const { accessToken, refreshToken: rToken, user: u } = res;

            saveTokens(accessToken, rToken);
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));

            toast.success("Registration successful!");
            navigate("/");
        } catch {
            toast.error("Registration failed.");
        }
    };

    // LOGIN
    const loginUser = async (email: string, password: string) => {
        try {
            const res = await loginAPI(email, password);
            const { accessToken, refreshToken: rToken, user: u } = res;

            saveTokens(accessToken, rToken);
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));

            toast.success("Login successful!");
            navigate("/");
        } catch {
            toast.error("Login failed.");
        }
    };

    // LOGOUT
    const logout = () => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.clear();
        toast.info("Logged out successfully.");
        navigate("/login");
    };

    const isLoggedIn = () => !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                refreshToken,
                saveTokens,
                registerUser,
                loginUser,
                logout,
                isLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
