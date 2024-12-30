import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import api from "../../../app/api";
import { Location }  from "../../../types/Location";
import { Archive, Delete } from "@mui/icons-material";
import DeleteDialog from "../../../components/DeleteDialog";
import { dataGridStyles } from "../../../styles/gridStyle"; 
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import moment from "moment";



const ManageLocations: React.FC = () => {
    const [locationRows, setLocationRows] = useState<Location[]>([]);
    const nav = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(false);


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
    }, [refresh]);

    const handleRowDoubleClick = (params: any) => {
        const locationId = params.row.id;
        console.log("Double-clicked location ID:", locationId);
        if (locationId) {
            //nav(`/updateLocation/${locationId}`); 
            nav('/updateLocation', { state: { locationId } });
        }
    };

    const archiveLocation = async (id: string) => {
        try {
            await api.put(`/Location/Archive/${id}`, { archived: true }); 
            setRefresh((prev) => !prev);
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
            setRefresh((prev) => !prev);
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
            field: "organizations",
            headerName: "Príslušnosť lokality k organizácií",
            width: 400,
            resizable: false,
            renderCell: (params) => {
                const organizations = params.row.organizations || [];
                return organizations.length > 0
                    ? organizations.join(", ")
                    : "..."; 
            },
        },
        {
            field: "adress",
            headerName: "Adresa",
            width: 200,
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
            width: 80,
            resizable: false,
        },
        {
            field: "lastEdited",
            headerName: "Posledná úprava",
            width: 250,
            resizable: false,
            valueGetter: (value, row) => row.created ? moment(row.created).format('DD.MM.YYYY HH:mm') : "Neplatný dátum",
        },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            resizable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="unarchive"
                        size="large"
                        onClick={() => {
                            console.log("Archive action for:", params.row.id);
                            archiveLocation(params.row.id);
                        }}
                    
                    >
                        <Archive />
                    </IconButton>
                    <IconButton
                        aria-label="unarchive"
                        size="large"
                        onClick={() => {
                            console.log("Unarchive action for:", params.row.id);
                            unArchiveLocation(params.row.id);
                        }}
                    >
                        <UnarchiveIcon />
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
                        isRowSelectable={(params) => params.id === "name"}
                        getRowClassName={(params) => 
                            params.row.archived ? 'archived-row' : ''
                        }
                        sx={dataGridStyles}
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

