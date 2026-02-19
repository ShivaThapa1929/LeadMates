import { Navigate, Outlet } from "react-router-dom";
import authService from "../api/authService";
import AccessDenied from "../pages/AccessDenied";

export default function RequireRole({ role }) {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const hasRole = user?.roles?.includes(role);

    if (!hasRole) {
        return <AccessDenied />;
    }

    return <Outlet />;
}
