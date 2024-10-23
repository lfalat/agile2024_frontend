import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../hooks/AuthProvider";

const HomePage: React.FC = () => {
    const auth = useAuth()

    const HandleLogout = () => {
        auth.logout()
    }

  return (
    <div>
        Vitajte
        <Button onClick={HandleLogout}>
            Logout
        </Button>
    </div>
  );
};

export default HomePage;