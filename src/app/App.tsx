import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/common/LoginPage";
import { useAuth } from "../hooks/AuthProvider";
import ProtectedRoute from "../auth/ProtectedRoute";
import RequiresAuth from "../auth/RequiresAuth";
import HomePage from "../pages/common/HomePage";
import "./App.css";
import Roles from "../types/Roles";
import RegisterUser from "../pages/spravca/Users/RegisterUser";
import ManageUsers from "../pages/spravca/Users/ManageUsers";
import ManageOrganizations from "../pages/spravca/Organizations/ManageOrganizations";
import NewOrganization from "../pages/spravca/Organizations/NewOrganization";
import ManageDivisions from "../pages/spravca/Divisions/ManageDivisions";
import NewDivision from "../pages/spravca/Divisions/NewDivision";
import ManageLocations from "../pages/spravca/Locations/ManageLocations";
import NewLocation from "../pages/spravca/Locations/NewLocation";
import ManageWorkPositions from "../pages/spravca/Work_Positions/ManageWorkPositions";
import NewWorkPosition from "../pages/spravca/Work_Positions/NewWorkPosition";
import Profile from "../pages/common/Profile";
import Settings from "../pages/common/Settings";
import PasswordChange from "../pages/common/PasswordChange";
import UpdateOrganization from "../pages/spravca/Organizations/UpdateOrganization";

const App: React.FC = () => {
    const auth = useAuth();

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={localStorage.getItem("accessToken") ? <Navigate to={"/home"} /> : <LoginPage />} />

                    {/* Requires auth */}
                    <Route element={<RequiresAuth />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/passwordChange" element={<PasswordChange />} />

                        {/* Role protected routes */}
                        {/* Spravca */}
                        <Route element={<ProtectedRoute allowedRoles={[Roles.Spravca]} />}>
                            <Route path="/manageUsers" element={<ManageUsers />} />
                            <Route path="/registerUser" element={<RegisterUser />} />

                            <Route path="/manageOrganizations" element={<ManageOrganizations />} />
                            <Route path="/newOrganization" element={<NewOrganization />} />
                            <Route path="/updateOrganization/:id" element={<UpdateOrganization />} />


                            <Route path="/manageDivisions" element={<ManageDivisions />} />
                            <Route path="/newDivisions" element={<NewDivision />} />

                            <Route path="/manageLocations" element={<ManageLocations />} />
                            <Route path="/newLocation" element={<NewLocation />} />

                            <Route path="/manageWorkPositions" element={<ManageWorkPositions />} />
                            <Route path="/newWorkPosition" element={<NewWorkPosition />} />
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
