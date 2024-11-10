import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography, Snackbar, Stack } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import UserProfile from "../../../types/UserProfile";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EmployeeCardDialog from "./EmployeCardDialog";

const ManageUsers: React.FC = () => {
    const [userRows, setUserRows] = useState<UserProfile[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        api.get("/User/Users")
            .then((res) => {
                const rows: UserProfile[] = res.data;
                setUserRows(rows);
            })
            .catch((err) => {
                setUserRows([]);
                console.error(err);
            });
    }, []);

    const handleCardOpen = (user: UserProfile) => {
        setOpenCardDialog(true);
    };

    const handleOpenDialog = (user: UserProfile) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleDelete = () => {
        if (selectedUser) {
            api.delete(`/User/Delete?email=${encodeURIComponent(selectedUser.email)}`)
                .then(() => {
                    setUserRows((prevRows) => prevRows.filter((user) => user.email !== selectedUser.email));
                    setOpenSnackbar(true); // Show success message
                })
                .catch((err) => console.error("Používateľ sa nevymazal:", err))
                .finally(() => handleCloseDialog()); // Close dialog
        }
    };

    const columns: GridColDef<UserProfile>[] = [
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
                        Zamestnanecka karta
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

    const handleEdit = (params: any) => {
        if (params.field !== "actions") {
            nav(`/changeUser/${params.row.email}`);
        }
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Správa používateľov
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => nav("/registerUser")}
                >
                    Pridať nového používateľa
                </Button>
                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={userRows}
                        onCellClick = {(params) => handleEdit(params)}
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

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Potvrdiť vymazanie</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Naozaj chcete vymazať túto položku? Operácia je nenávratná.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Zrušiť
                        </Button>
                        <Button onClick={handleDelete} color="primary">
                            Vymazať
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Success Snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    message="Položka bola úspešne vymazaná"
                />
                
                {/* Employee Card Dialog */}
                <EmployeeCardDialog
                    open={openCardDialog}
                    handleClose={() => setOpenCardDialog(false)}
                />
            </Box>
        </Layout>
    );
};

export default ManageUsers;
