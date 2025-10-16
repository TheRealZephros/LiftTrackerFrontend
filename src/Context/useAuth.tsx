import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User"
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";

type UserContextType = {
    user: UserProfile | null,
    token: string | null,
    registerUser: (email: string, userName: string, password: string) => void,
    loginUser: (email: string, password: string) => void,
    logout: () => void,
    isLoggedIn: () => boolean
}

type UserProviderProps = {children: React.ReactNode}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({children}: UserProviderProps)  => {
    
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setIsReady(true);
    }, []);

    const registerUser = async (
        email: string,
        userName: string,
        password: string
    ) => {
        await registerAPI(email, userName, password).then( res => {
            if (res){
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    email: res?.data.email,
                    userName: res?.data.userName
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token);
                setUser(userObj!);
                toast.success("Registration successful!");
                navigate("/");
            }
        }).catch( err => {
            toast.warning("Registration failed. Please try again.");
        });
    }

    const loginUser = async (
        email: string,
        password: string
    ) => {
        await loginAPI(email, password).then( res => {
            if (res){
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    email: res?.data.email,
                    userName: res?.data.userName
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token);
                setUser(userObj!);
                toast.success("Login successful!");
                navigate("/");
            }
        }).catch( err => {
            toast.warning("Login failed. Please try again.");
        });
    }

    const isLoggedIn = () => {
        return !!user;
    }

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken("");
        toast.info("Logged out successfully.");
        navigate("/");
    }

    return (
        <UserContext.Provider value={{user, token, registerUser, loginUser, logout, isLoggedIn}}
        > 
        {isReady ? children : null}
        </UserContext.Provider>
    )
};

export const useAuth = () => React.useContext(UserContext);