import { useAuth } from "../hooks/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
    allowedRoles: string[]
}

const ProtectedRoute = ({allowedRoles}: Props) => {
    const auth = useAuth();
    console.log(allowedRoles[0] + ' ' + auth?.cookies.user?.role)

    return allowedRoles.includes(auth?.cookies.user?.role) ? <Outlet /> : <Navigate to='/unauthorized' replace />
}

export default ProtectedRoute