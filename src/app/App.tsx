import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/common/LoginPage";
import { useAuth } from "../hooks/AuthProvider";
import ProtectedRoute from "../auth/ProtectedRoute";
import UnauthorizedPage from "../pages/common/UnauthorizedPage";
import RequiresAuth from "../auth/RequiresAuth";
import HomePage from "../pages/common/HomePage";
import "./App.css";
import RegisterUser from "../pages/spravca/registerUser";
import ManageUsers from "../pages/spravca/manageUsers";
import Roles from "../types/Roles";

const App: React.FC = () => {
    const auth = useAuth();

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={localStorage.getItem("accessToken") ? <Navigate to={"/home"} /> : <LoginPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Requires auth */}
                    <Route element={<RequiresAuth />}>
                        <Route path="/home" element={<HomePage />} />

                        {/* Role protected routes */}
                        {/* Spravca */}
                        <Route element={<ProtectedRoute allowedRoles={[Roles.Spravca]} />}>
                            <Route path="/registerUser" element={<RegisterUser />} />
                            <Route path="/manageUsers" element={<ManageUsers />} />
                        </Route>
                    </Route>

                    {/* Default route */}
                    <Route path="*" element={<Navigate to={localStorage.getItem("accessToken") ? "/home" : "/login"} />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
