import React from "react";
import { Box, CircularProgress } from "@mui/material";
import Layout from "../components/Layout";

function useLoading(isLoading: boolean) {
    if (isLoading) {
        return (
            <Layout>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }
    return null;
}

export default useLoading;