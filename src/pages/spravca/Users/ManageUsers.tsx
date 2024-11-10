import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Button, Typography, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import UserProfile from "../../../types/UserProfile";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageUsers: React.FC = () => {
    const [userRows, setUserRows] = useState<UserProfile[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
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
                    setUserRows((prevRows) => prevRows.filter((user) => user.email  !== selectedUser.email ));
                    setOpenSnackbar(true); // Show success message
                })
                .catch((err) => console.error("Používateľ sa nevymazal:", err))
                .finally(() => handleCloseDialog()); // Close dialog
        }
    };

    const columns: GridColDef<UserProfile>[] = [
        { field: "email", headerName: "Používateľské meno", width: 200, resizable: false },
        { field: "firstName", headerName: "Meno", width: 150, resizable: false },
        { field: "lastName", headerName: "Priezvisko", width: 150, resizable: false },
        { field: "titleBefore", headerName: "Tituly pred menom", width: 150, resizable: false },
        { field: "titleAfter", headerName: "Tituly za menom", width: 150, resizable: false },
        { field: "role", headerName: "Rola používateľa", width: 150, resizable: false },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            resizable: false,
            renderCell: (params) => (
                <Chip
                    label = {<DeleteIcon />}
                    onClick={() => handleOpenDialog(params.row)}
                />
            ),
        }
    ];
    const handleEdit = (params: any) => {
        if(params.field != "actions")
        {
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
            </Box>
        </Layout>
    );
};

export default ManageUsers;