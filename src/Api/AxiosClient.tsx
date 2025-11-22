// src/api/axiosClient.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../Context/useAuth";
import { useContext, useMemo } from "react";

export const useAxiosClient = () => {
    const auth = useContext(AuthContext);

    return useMemo(() => {
        const client = axios.create({
            baseURL: "https://localhost:7080/api/",
        });

        client.interceptors.request.use(async (config) => {
            const token = auth.token;
            const refreshToken = auth.refreshToken;

            if (!token) return config;

            const decoded: any = jwtDecode(token);
            const isExpired = decoded.exp * 1000 < Date.now();

            if (!isExpired) {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            }

            // ---- Access token expired → Try refresh ----
            try {
                const refreshResponse = await axios.post(
                    "https://localhost:7080/api/user/refresh",
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefresh } = refreshResponse.data;

                auth.saveTokens(accessToken, newRefresh);

                config.headers.Authorization = `Bearer ${accessToken}`;
                return config;
            } catch (err) {
                console.error("Refresh token invalid → logging out");
                auth.logout();
                throw err;
            }
        });

        return client;
    }, [auth]);
};
