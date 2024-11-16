import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography, Snackbar, Stack } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import UserProfile from "../../../types/UserProfile";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { EmployeeCard } from "../../../types/EmployeeCard";

const AssignEmployeeToGoal: React.FC = () => {
    const [userRows, setUserRows] = useState<EmployeeCard[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<EmployeeCard | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        api.get("/EmployeeCard/EmployeeCards")
            .then((res) => {
                const rows: EmployeeCard[] = res.data;
                setUserRows(rows);
            })
            .catch((err) => {
                setUserRows([]);
                console.error(err);
            });
    }, []);

    const handleCardOpen = (user: EmployeeCard) => {
        setOpenCardDialog(true);
    };

    const handleOpenDialog = (user: EmployeeCard) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };



    const columns: GridColDef<EmployeeCard>[] = [
        { field: "email", headerName: "Používateľské meno", width: 200 },
        { field: "firstName", headerName: "Meno", width: 150 },
        { field: "lastName", headerName: "Priezvisko", width: 150 },
        { field: "role", headerName: "Rola používateľa", width: 150 },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            renderCell: (params) => (
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'orange', color: 'black', fontSize: '12px', textWrap: "wrap" }}
                        onClick={() => handleCardOpen(params.row)}
                    >
                        Pridať
                    </Button>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleOpenDialog(params.row)}
                        sx={{ color: 'red' }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        }
    ];


    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Pridať zamestnanca
                </Typography>
                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={userRows}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                            pinnedColumns: {
                                right: ["actions"],
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        pagination
                    />
                </Box>


                {/* Success Snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    message="Položka bola úspešne vymazaná"
                />
            </Box>
        </Layout>
    );
};

export default AssignEmployeeToGoal;
