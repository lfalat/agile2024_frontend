import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    Typography,
    Snackbar,
    Stack,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import UserProfile from "../../../types/UserProfile";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EmployeeCardDialog from "./EmployeCardDialog";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridStyles } from "../../../styles/gridStyle";
import { useSnackbar } from "../../../hooks/SnackBarContext";

const ManageUsers: React.FC = () => {
    const [userRows, setUserRows] = useState<UserProfile[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    //const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const nav = useNavigate();
    const { openSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchData = () => {
            Promise.all([api.get<UserProfile[]>("/User/Users"), api.get("/EmployeeCard/GetAll/")])
                .then(([userRes, employeeCardRes]) => {
                    const users = userRes.data;
                    const employeeCards = employeeCardRes.data;
                    console.log(employeeCards);
                    console.log(users);

                    const updatedRows = users.map((user) => {
                        const matchingCard = employeeCards.find((card: any) => {
                            return String(card.user.id).trim() === String(user.id).trim();
                        });
                        console.log(matchingCard);
                        return {
                            ...user,
                            deactivated: matchingCard ? matchingCard.archived : false,
                        };
                    });

                    setUserRows(updatedRows);
                    console.log(updatedRows); // Log updated rows
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setUserRows([]); // Reset rows on error
                });
        };

        fetchData();
    }, [refresh]);

    const handleCardOpen = (user: UserProfile) => {
        console.log("Selected User: ", user);
        setSelectedUser(user);
        setOpenCardDialog(true);
    };

    const handleOpenDialog = (user: UserProfile) => {
        console.log(user);
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleDeactivate = (user: UserProfile) => {
        if (!user.deactivated) {
            openSnackbar("Deaktivujem kartu.", "success");
        } else {
            openSnackbar("Aktivujem kartu.", "success");
        }
        api.post(`/EmployeeCard/Deactivate/${user.id}`)
            .then((res) => {
                setRefresh((prev) => !prev);
                console.log(res);

                setUserRows((prevRows) =>
                    prevRows.map((row) => (row.id === user.id ? { ...row, deactivated: true } : row))
                );
                if (!user.deactivated) {
                    openSnackbar("Karta deaktivovaná.", "success");
                } else {
                    openSnackbar("Karta aktivovaná.", "success");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelete = () => {
        if (selectedUser) {
            api.delete(`/User/Delete?email=${encodeURIComponent(selectedUser.email)}`)
                .then(() => {
                    setUserRows((prevRows) => prevRows.filter((user) => user.email !== selectedUser.email));
                    openSnackbar("Profil uspešne zmazaný", "success"); // Show success message
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
        { field: "", headerName: "", flex: 1 },
        {
            field: "actions",
            headerName: "Akcie",
            width: 300,
            renderCell: (params) => (
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "orange", color: "black", fontSize: "12px", textWrap: "wrap" }}
                        onClick={() => handleCardOpen(params.row)}
                    >
                        Zamestnanecka karta
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "lightgray",
                            color: "black",
                            fontSize: "12px",
                            textWrap: "wrap",
                        }}
                        onClick={() => handleDeactivate(params.row)}
                    >
                        {params.row.deactivated ? "Aktivovať" : "Deaktivovať"}
                    </Button>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleOpenDialog(params.row)}
                        sx={{ color: "red" }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        },
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
                    <DataGrid
                        columns={columns}
                        rows={userRows}
                        onRowDoubleClick={(params) => handleEdit(params)}
                        isRowSelectable={(params) => params.id === "name"} // Allow only the first column to be selectable
                        getRowClassName={(params) => (params.row.deactivated ? "archived-row" : "")}
                        sx={dataGridStyles}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        pagination
                        getRowId={(row) => row.id}
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

                {/* Employee Card Dialog */}
                <EmployeeCardDialog
                    userId={selectedUser?.id ?? null}
                    user={selectedUser}
                    open={openCardDialog}
                    handleClose={() => setOpenCardDialog(false)}
                />
            </Box>
        </Layout>
    );
};

export default ManageUsers;
