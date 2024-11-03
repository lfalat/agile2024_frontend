import * as React from "react";
import Layout from "../../components/Layout";
import { Button, Typography } from "@mui/material";
import { useAuth } from "../../hooks/AuthProvider";


const HomeScreen: React.FC = () => {

  const auth = useAuth();

  return (
    <Layout>
      <Typography>
        Vitajte doma
      </Typography>
    </Layout>
  );
};

export default HomeScreen;