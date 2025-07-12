import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        const fetchUser = async () => {
            if (token && expiry && Date.now() < Number(expiry)) {
                try {
                    const me = await authApi.getMe();
                    setUser(me);
                    console.log("User restored from /auth/me");
                } catch (error) {
                    console.error("Failed to fetch user:", error)
                    authApi.logout();
                }
            } else {
                console.log("Token expired or missing");
                authApi.logout();
            }

            setIsLoading(false);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const expiry = localStorage.getItem("tokenExpiry");

        if (!expiry || !user) return;

        const timeLeft = Number(expiry) - Date.now();
        if (timeLeft <= 0) {
            authApi.logout();
        } else {
            const timeout = setTimeout(() => {
                authApi.logout();
                console.log("Token expired, logged out");
            }, timeLeft);
            
            return () => clearTimeout(timeout);
        } 


    }, [user]);

    const login = async (credentials) => {
        try {
            await authApi.login(credentials);
            const me = await authApi.getMe();
            setUser(me);
            return me;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }} >
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};