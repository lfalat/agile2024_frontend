import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography, Snackbar, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { dataGridStyles } from "../../../styles/gridStyle";
import Adaptations from "../../../types/Adaptations";


import UserProfile from "../../../types/UserProfile";
import api from "../../../app/api";


const ManageAdaptations: React.FC = () => {
    const [adaptations, setAdaptations] = useState<Adaptations[]>([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [openGoalDetailsDialog, setOpenGoalDetailsDialog] = useState(false); // Modal state
    const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null); // For showing employee card dialog
    
    const [openEmployeesModal, setOpenEmployeesModal] = useState(false); 


    const nav = useNavigate();

    useEffect(() => {
        api.get("/Adaptation/GetAdaptations")
            .then((res) => {
                console.log("prijate:", res.data);
                setAdaptations(res.data)
                
            })
            .catch((err) => {
                console.error(err);
                setAdaptations([])
                
            });
    }, []);

    const handleDetailClick = (id: string) => {
        nav("/updateAdaptation", { state: { id } });
    };

    const formatDate = (date: string) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("sk-SK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const columns: GridColDef<Adaptations>[] = [
        { field: "nameEmployee", headerName: "Meno Zamestnanca", flex: 1  },
        { field: "nameSupervisor", headerName: "Zodpovedný zamestnanec", flex: 1  },
        {
            field: "readyDate",
            headerName: "Termín pripravenosti",
            flex: 1, 
            valueGetter: (_, row) => formatDate(row.readyDate)
        },
        { field: "taskState", headerName: "Stav úloh", flex: 0.8  },
        {
            field: "endDate",
            headerName: "Dátum dokončenia",
            flex: 1 ,
            valueGetter: (_, row) => formatDate(row.endDate)
        },
        {
            field: "actions",
            headerName: "Akcia",
            flex: 1 ,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDetailClick(params.row.id)}
                >
                    Detail
                </Button>
            )
        }
    ];
    
    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Adaptácia zamestnancov
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => nav("/newAdaptation")}
                >
                    Vytvoriť novú adaptáciu
                </Button>
                <Box sx={{ width: "100%" }}>
                    <DataGrid
                        rows={adaptations}
                        columns={columns}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[5, 10, 25]}
                        pagination
                        sx={dataGridStyles}
                    />
                </Box>

            </Box>
        </Layout>
    );
};

export default ManageAdaptations;
