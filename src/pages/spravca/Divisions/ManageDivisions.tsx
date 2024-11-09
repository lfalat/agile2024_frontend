import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import { useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import api from "../../../app/api";
import { Department } from "../../../types/Department";
import { Archive, Delete } from "@mui/icons-material";
import DeleteDialog from "../../../components/DeleteDialog";


const ManageDivisions: React.FC = () => {
    const [departmentRows, setDepartmentRows] = useState<Department[]>([]);
    const nav = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);


    useEffect(() => {
        api.get("/Department/Departments")
            .then((res) => {
                const rows: Department[] = res.data;
                console.log("Response: ", res.data);
                setDepartmentRows(rows);
            })
            .catch((err) => {
                setDepartmentRows([]);
                console.error(err);
            });
    }, []);

    const archiveDepartment = async (id: string) => {
        try {
            await api.put(`/Department/Archive/${id}`, { archived: true }); 
            setDepartmentRows((prevRows) =>
                prevRows.map((department) =>
                    department.id === id ? { ...department, archived: true } : department
                )
            );
            console.log(`Department ${id} archived successfully.`);
        } catch (err) {
            console.error("Error archiving department:", err);
        }
    };

    const unArchiveDepartment = async (id: string) => {
        try {
            await api.put(`/Department/Unarchive/${id}`, { archived: false }); 
            setDepartmentRows((prevRows) =>
                prevRows.map((department) =>
                    department.id === id ? { ...department, archived: false } : department
                )
            );
            console.log(`Department ${id} archived successfully.`);
        } catch (err) {
            console.error("Error archiving department:", err);
        }
    };

    /*const deleteDepartment = async (id: string) => {
        try {
            await api.delete(`/Department/Delete/${id}`);
            console.log(`Department ${id} deleting.`);
            setDepartmentRows((prevRows) =>
                prevRows.filter((department) => department.id !== id)
            );

            console.log(`Department ${id} deleted successfully.`);
            alert("Oddelenie úspešne vymazané!")
        } catch (err:any) {
            if (err.response && err.response.status === 400) {
                alert("Oddeleniu prislúchajú zamestnanci")
            } else {
                console.error("Error deleting department:", err);
            }
        }
    };*/

    const handleDeleteClick = (id: string) => {
        setSelectedDepartmentId(id);
        setDialogOpen(true);
    }

    const confirmDelete = async () => {
        if (selectedDepartmentId) {
            try {
                await api.delete(`/Department/Delete/${selectedDepartmentId}`);
                setDepartmentRows((prevRows) =>
                    prevRows.filter((department) => department.id !== selectedDepartmentId)
                );
                setSnackbarOpen(true);
            } catch (err: any) {
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.message);
                    setSnackbarOpen(true);
                } else {
                    console.error("Error deleting department:", err);
                }
            } finally {
                setDialogOpen(false);
                setSelectedDepartmentId(null);
            }
        }
    };

    //<(typeof departmentRows)[number]>
    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Názov oddelenia",
            width: 200,
            resizable: false,
        },
        {
            field: "code",
            headerName: "Kód oddelenia",
            width: 250,
            resizable: false,
        },
        {
            field: "organizationName",
            headerName: "Príslušná organizácia",
            width: 250,
            resizable: false,
        },
        {
            field: "created",
            headerName: "Dátum vytvorenia oddelenia",
            width: 250,
            resizable: false,
        },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            resizable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            console.log("Archive action for:", params.row.id);
                            archiveDepartment(params.row.id);
                        }}
                    
                    >
                        <Archive />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => {
                            console.log("Unarchive action for:", params.row.id);
                            unArchiveDepartment(params.row.id);
                        }}
                    >
                        <Archive />
                    </IconButton>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            console.log("Archive action for:", params.row.id);
                            handleDeleteClick(params.row.id);
                        }}
                    >
                        <Delete />
                    </IconButton>
                </>
            ),
        }
    ];

    

    const handleRowDoubleClick = (params: any) => {
        const departmentId = params.row.id;
        nav(`/editDivision/${departmentId}`);
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Správa oddelení
                </Typography>
                <Button variant="contained" color="primary"
                    sx={{ marginBottom: 2 }} onClick={() => { nav("/newDivision");}}
                >
                    Pridať nové oddelenie
                </Button>

                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={departmentRows}
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
                        onRowDoubleClick={handleRowDoubleClick}
                    />
                    <DeleteDialog
                        open={isDialogOpen}
                        onClose={() => setDialogOpen(false)}
                        onConfirm={confirmDelete}
                    />

                    <Snackbar
                        open={isSnackbarOpen}
                        autoHideDuration={6000}
                        onClose={() => setSnackbarOpen(false)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <Alert
                            onClose={() => setSnackbarOpen(false)}
                            severity={errorMessage ? "error" : "success"}
                            sx={{ width: "100%" }}
                        >
                            {errorMessage || "Položka bola úspešne vymazaná."}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Layout>
    );
};

export default ManageDivisions;
