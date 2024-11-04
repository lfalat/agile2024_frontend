import { Box, Button, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

const ManageOrganizations: React.FC = () => {

    const nav = useNavigate();

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Správa organizácií
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => {
                        nav("/registerUser");
                    }}
                >
                    Pridať novu organizáciu
                </Button>
            </Box>
        </Layout>
    );
}

export default ManageOrganizations