import { Box, Button, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

const ManageDivisions: React.FC = () => {
    const nav = useNavigate();

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Správa oddelení
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => {
                        nav("/newDivision");
                    }}
                >
                    Pridať nové oddelenie
                </Button>
            </Box>
        </Layout>
    );
};

export default ManageDivisions;
