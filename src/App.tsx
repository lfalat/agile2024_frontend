import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import HomeScreen from "./pages/HomeScreen";
import NewUserScreen from "./pages/NewUserScreen";
const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/newUser" element={<NewUserScreen />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
