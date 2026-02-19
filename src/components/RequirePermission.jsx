import { Navigate, Outlet } from "react-router-dom";
import authService from "../api/authService";
import AccessDenied from "../pages/AccessDenied";

export default function RequirePermission({ permission }) {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const hasPermission = user?.permissions?.includes(permission) || user?.roles?.includes('Admin');

    if (!hasPermission) {
        return <AccessDenied />;
    }

    return <Outlet />;
}
