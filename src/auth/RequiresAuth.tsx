import { useAuth } from "../hooks/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const RequiresAuth = () => {
    const auth = useAuth();

    return auth?.cookies.user ? <Outlet /> : <Navigate to='/' replace />;
}

export default RequiresAuth