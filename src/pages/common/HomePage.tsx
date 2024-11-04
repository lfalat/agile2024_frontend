import * as React from "react";
import Layout from "../../components/Layout";
import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../../hooks/AuthProvider";

const HomeScreen: React.FC = () => {
    const { userProfile } = useAuth();

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              Vitajte doma {userProfile?.titleBefore} {userProfile?.firstName} {userProfile?.lastName} {userProfile?.titleAfter}
            </Box>
        </Layout>
    );
};

export default HomeScreen;
