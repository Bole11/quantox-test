import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { LoadingSpinner } from "./LoadingSpinner.jsx";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ redirectPath = '/', children }) => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <Navigate to={redirectPath} replace />
    }

    return children;
};