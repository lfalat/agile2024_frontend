import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../hooks/AuthProvider";
import ProtectedRoute from "../auth/ProtectedRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import RequiresAuth from "../auth/RequiresAuth";
import HomePage from "../pages/HomePage";
import AdminPage from "../pages/AdminPage";
import './App.css'

const App: React.FC = () => {
  const auth = useAuth()

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={auth?.cookies.user ? <Navigate to={'/home'} replace/> : <LoginPage />} />
          <Route path='/unauthorized' element={<UnauthorizedPage />} />

          {/* Requires auth */}
          <Route element={<RequiresAuth />}>
            <Route path='/home' element={<HomePage />}/>

            {/* Role protected routes */}
            <Route element={<ProtectedRoute allowedRoles={['Spravca']}/>}>
              <Route path='/admin' element={<AdminPage />} />
            </Route>
          </Route>

          {/* Default route */}
          <Route path='*' element={<Navigate to={'/'} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
