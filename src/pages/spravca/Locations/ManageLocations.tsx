import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import api from "../../../app/api";
import { Location }  from "../../../types/Location";
import { Archive, Delete } from "@mui/icons-material";
import DeleteDialog from "../../../components/DeleteDialog";


const ManageLocations: React.FC = () => {
    const [locationRows, setLocationRows] = useState<Location[]>([]);
    const nav = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);


    useEffect(() => {
        api.get("/Location/Locations")
            .then((res) => {
                console.log("Načítané údaje:", res.data);
                const rows: Location[] = res.data;
                setLocationRows(rows);
            })
            .catch((err) => {
                setLocationRows([]);
                console.error(err);
            });
    }, []);

    const handleRowDoubleClick = (params: any) => {
        // Získame ID lokality z riadku
        const locationId = params.row.id;
        console.log("Double-clicked location ID:", locationId); // Skontrolujte, či sa správne získava ID
        if (locationId) {
            nav(`/updateLocation/${locationId}`);  // Presmerovanie na stránku úpravy s ID
        }
    };

    const archiveLocation = async (id: string) => {
        try {
            await api.put(`/Location/Archive/${id}`, { archived: true }); 
            setLocationRows((prevRows) =>
                prevRows.map((location) =>
                    location.id === id ? { ...location, archived: true } : location
                )
            );
            console.log(`Lokalita ${id} archivovaná úspešne.`);
        } catch (err) {
            console.error("Problém s archiváciou lokality:", err);
        }
    };

    const unArchiveLocation = async (id: string) => {
        try {
            await api.put(`/Location/Unarchive/${id}`, { archived: false }); 
            setLocationRows((prevRows) =>
                prevRows.map((location) =>
                    location.id === id ? { ...location, archived: false } : location
                )
            );
            console.log(`Lokalita ${id} unarchivovaná úspešne.`);
        } catch (err) {
            console.error("Problém s unarchiváciou lokality:", err);
        }
    };

    const handleDeleteClick = (id: string) => {
        setSelectedLocationId(id);
        setDialogOpen(true);
    }

    const confirmDelete = async () => {
        if (selectedLocationId) {
            try {
                await api.delete(`/Location/Delete/${selectedLocationId}`);
                setLocationRows((prevRows) =>
                    prevRows.filter((location) => location.id !== selectedLocationId)
                );
                setSnackbarOpen(true);
            } catch (err: any) {
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.message);
                    setSnackbarOpen(true);
                } else {
                    console.error("Error deleting location:", err);
                }
            } finally {
                setDialogOpen(false);
                setSelectedLocationId(null);
            }
        }
    }
  
    const columns: GridColDef<(typeof locationRows)[number]>[] = [
        {
            field: "name",
            headerName: "Názov Lokality",
            width: 200,
            resizable: false,
        },
        {
            field: "code",
            headerName: "Kód lokality",
            width: 150,
            resizable: false,
        },
        {
            field: "lokalita",
            headerName: "Príslušnosť lokality k organizácií",
            width: 300,
            resizable: false,
        },
        {
            field: "adress",
            headerName: "Adresa",
            width: 150,
            resizable: false,
        },
        {
            field: "city",
            headerName: "Mesto",
            width: 150,
            resizable: false,
        },
        {
            field: "zipCode",
            headerName: "PSC",
            width: 150,
            resizable: false,
        },
        {
            field: "lastEdited",
            headerName: "Posledná úprava",
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
                            archiveLocation(params.row.id);
                        }}
                    
                    >
                        <Archive />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => {
                            console.log("Unarchive action for:", params.row.id);
                            unArchiveLocation(params.row.id);
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

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Správa lokalít
                </Typography>
                <Button variant="contained" color="primary"
                    sx={{ marginBottom: 2 }} onClick={() => { nav("/newLocation");}}
                >
                    Pridať novú lokalitu
                </Button>

                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={locationRows}
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

export default ManageLocations

