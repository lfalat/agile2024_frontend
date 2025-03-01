import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography, Snackbar, Stack, Tooltip } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import UserProfile from "../../../types/UserProfile";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import EmployeeCardDialog from "../../spravca/Users/EmployeCardDialog";
import { Review } from "../../../types/Review";
import { EmployeeCard } from "../../../types/EmployeeCard";

const ManageReviews: React.FC = () => {
    const [reviewRows, setReviewRows] = useState<Review[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [openReviewDetailsDialog, setOpenReviewDetailsDialog] = useState(false); // Modal state
    const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null); // For showing employee card dialog
    const [selectedEmployees, setSelectedEmployees] = useState<SimplifiedEmployeeCard[]>([]); // Vybraní zamestnanci
    const [openEmployeesModal, setOpenEmployeesModal] = useState(false); 


    const nav = useNavigate();

    useEffect(() => {
        api.get("/Review/Reviews")
            .then((res) => {
                console.log("Received reviews:", res.data);
                setReviewRows(res.data);
            })
            .catch((err) => {
                setReviewRows([]);
                console.error(err);
            });
    }, []);


    const handleOpenDialog = (review: Review) => {
        setSelectedReview(review);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReview(null);
    };


    // const handleEdit = (id: string, field: string) => {
    //     if (field === "actions") { 
    //         if (id) {
    //             //nav(`/editGoal/${id}`); 
    //             nav('/editGoal', { state: { id} });
    //         } else {
    //             console.error("Goal ID is missing or invalid");
    //         }
    //     } else {
    //         console.log("Click event did not originate from the actions column");
    //     }
    // };
    
    const handleRowClick = (params: any) => {
        const review = reviewRows.find(review => review.id === params.row.id);       
        setSelectedReview(review || null);
        setOpenReviewDetailsDialog(true);
    };

    const handleCloseReviewDetailsDialog = () => {
        setOpenReviewDetailsDialog(false);
    };
    

    const handleEmployeeCardClick = async (employeeCardId: string) => {
        const response = await api.get(`/EmployeeCard/GetUserByEmployeeCard?employeeCardId=${employeeCardId}`);
        const userProfile: UserProfile = response.data; 

        setSelectedEmployee(userProfile);
        //setSelectedEmployee(employee);
        setOpenCardDialog(true); // Show employee card dialog
    };

    type SimplifiedEmployeeCard = {
        id: string;
        name: string;
        surname: string;
    };
    
    const handleEmployeeClick = (employees: SimplifiedEmployeeCard[]) => {
        setSelectedEmployees(employees);
        setOpenEmployeesModal(true); // Otvorenie modálneho okna
    };

    

    const getDate = (date: any) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("sk-SK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };
    
    const columnsUser: GridColDef[] = [
        { field: "name", headerName: "Meno", width: 150 },
        { field: "surname", headerName: "Priezvisko", width: 150 },
    ];
    

    const columns: GridColDef<Review>[] = [
        { field: "name", headerName: "Názov posudku", width: 150 },
        { field: "status", headerName: "Stav", width: 150 },
        {   field: "assignedEmployees", 
            headerName: "Priradený zamestnanec", 
            width: 200,
            renderCell: (params) => {
                const assignedEmployees = params.row.assignedEmployees || [];
                const employeeNames = assignedEmployees.map(emp => `${emp.name} ${emp.surname}`);
    
                return (
                    <Tooltip title={employeeNames.join(', ')}>
                        <Typography 
                            variant="body2" 
                            noWrap 
                            sx={{ 
                                cursor: 'pointer', 
                                textDecoration: 'underline',
                                '&:hover': { color: 'gray' }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEmployeeClick(assignedEmployees);
                            }}
                        >
                            {employeeNames.length > 3 ? `${employeeNames.slice(0, 3).join(', ')}...` : employeeNames.join(', ')}
                        </Typography>
                    </Tooltip>
                );
            }
        },
        { 
            field: "creationTimestamp", 
            headerName: "Dátum a čas vytvorenia posudku", 
            width: 200, 
            valueGetter: (params: { row: Review }) => getDate(params.row.creationTimestamp) 
        },
        { 
            field: "completionTimestamp", 
            headerName: "Dátum a čas dokončenia posudku", 
            width: 200, 
            valueGetter: (params: { row: Review }) => getDate(params.row.completionTimestamp) 
        },
    ];

    

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Ciele a rozvoj môjho tímu
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => nav("/newReview")}
                >
                    Vytvoriť nový posudok
                </Button>
                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={reviewRows}
                        onRowClick={handleRowClick}
                        pageSizeOptions={[5, 10, 25]}
                        pagination
                    />
                </Box>


                {/* Modálne okno na zobrazenie zamestnancov */}
                <Dialog open={openEmployeesModal} onClose={() => setOpenEmployeesModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Priradení zamestnanci</DialogTitle>
                    <DialogContent>
                        <Box sx={{ height: 300 }}>
                            <DataGridPro
                                columns={columnsUser}
                                rows={selectedEmployees.map((emp) => ({
                                    id: emp.id,
                                    name: emp.name,
                                    surname: emp.surname,
                                }))}
                                pageSizeOptions={[5, 10, 25]} 
                                pagination
                                onRowClick={(params) => handleEmployeeCardClick(params.row.id)}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEmployeesModal(false)} color="primary">
                            Zatvoriť
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Employee Card Dialog */}
                <EmployeeCardDialog
                    open={openCardDialog}
                    handleClose={() => setOpenCardDialog(false)}  userId={selectedEmployee?.id}  
                    user={selectedEmployee}                />

    
            </Box>
        </Layout>
    );
};

export default ManageReviews;
