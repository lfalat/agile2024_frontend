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
import { dataGridStyles } from "../../../styles/gridStyle";


const ManageReviews: React.FC = () => {
    const [reviewRows, setReviewRows] = useState<Review[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [openReviewDetailsDialog, setOpenReviewDetailsDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null);
    const [selectedEmployees, setSelectedEmployees] = useState<SimplifiedEmployeeCard[]>([]);
    const [openEmployeesModal, setOpenEmployeesModal] = useState(false); 


    const nav = useNavigate();

    useEffect(() => {
        api.get("/Review/GetReviews")
            .then((res) => {
                console.log("Received reviews:", res.data);
                setReviewRows(res.data);
            })
            .catch((err) => {
                setReviewRows([]);
                console.error(err);
            });
    }, []);

    const handleRowDoubleClick = (params: any) => {
        const id = params.row.id;
        console.log("Double-clicked ID:", id);
        if (!id) {
            console.warn("No ID found for this row:", params.row);
            return;
        }
        if (id && params.row.completedAt == null) {
            nav('/updateReview', { state: { id } });
        }
    };

    const handleOpenDialog = (review: Review) => {
        setSelectedReview(review);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReview(null);
    };
    
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
        setOpenCardDialog(true);
    };

    type SimplifiedEmployeeCard = {
        id: string;
        name: string;
        surname: string;
    };
    
    const handleEmployeeClick = (employees: SimplifiedEmployeeCard[]) => {
        setSelectedEmployees(employees);
        setOpenEmployeesModal(true);
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
        { field: "reviewName", headerName: "Názov posudku", width: 250 },
        { field: "status", headerName: "Stav", width: 150 },
        {   field: "assignedEmployees", 
            headerName: "Priradený zamestnanec", 
            width: 200,
            renderCell: (params) => {
                const assignedEmployees = params.row.assignedEmployees || [];
                const employeeNames = assignedEmployees.map(emp => `${emp.name}`);
                const employeeIds = assignedEmployees.map(emp => emp.id);
    
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
            field: "createdAt", 
            headerName: "Dátum a čas vytvorenia posudku", 
            width: 250, 
            //valueGetter: (params: { row: Review }) => getDate(params.row.createdAt) 
        },
        { 
            field: "completedAt", 
            headerName: "Dátum a čas dokončenia posudku", 
            width: 250, 
            //valueGetter: (params: { row: Review }) => getDate(params.row.completedAt) 
        },
    ];

    

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Zoznam posudkov
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
                        onRowDoubleClick={handleRowDoubleClick}
                        getRowClassName={(params) => {
                            return params.row.completedAt === null ? "notReaded-row" : "";
                        }}                        
                        sx={dataGridStyles}
                    />
                </Box>


                
    
            </Box>
        </Layout>
    );
};


export default ManageReviews;
