import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography, Snackbar, Stack, Tooltip } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import UserProfile from "../../../types/UserProfile";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EmployeeCardDialog from "../../spravca/Users/EmployeCardDialog";
import Goal from "../../../types/Goal";

const ManageGoals: React.FC = () => {
    const [goalRows, setGoalRows] = useState<Goal[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [openGoalDetailsDialog, setOpenGoalDetailsDialog] = useState(false); // Modal state

    const nav = useNavigate();

    useEffect(() => {
        api.get("/Goal/Goals")
            .then((res) => {
                console.log("prijate:", res.data);
                const rows: Goal[] = res.data;
                setGoalRows(rows);
            })
            .catch((err) => {
                setGoalRows([]);
                console.error(err);
            });
    }, []);


    const handleOpenDialog = (goal: Goal) => {
        setSelectedGoal(goal);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedGoal(null);
    };

    const handleDelete = () => {
        if (selectedGoal) {
            api.delete(`/Goal/Delete/${selectedGoal.id}`)
                .then(() => {
                    setGoalRows((prevRows) => prevRows.filter((goal) => goal.id !== selectedGoal.id));
                    setOpenSnackbar(true); // Show success message
                })
                .catch((err) => console.error("Cieľ sa nevymazal:", err))
                .finally(() => handleCloseDialog()); // Close dialog
        }
    };

    const handleEdit = (id: string, field: string) => {
        if (field === "actions") { 
            if (id) {
                nav(`/editGoal/${id}`); 
            } else {
                console.error("Goal ID is missing or invalid");
            }
        } else {
            console.log("Click event did not originate from the actions column");
        }
    };
    const handleRowClick = (params: any) => {
        const goal = goalRows.find(goal => goal.id === params.row.id);       
        setSelectedGoal(goal || null);
        setOpenGoalDetailsDialog(true);
    };

    const handleCloseGoalDetailsDialog = () => {
        setOpenGoalDetailsDialog(false);
    };
    

    const generateRows = (goals: Goal[]) => {
        const rows: any[] = [];
        goals.forEach(goal => {
            const assignedEmployees = goal.assignedEmployees;
            
            // Check if there are assigned employees
            if (assignedEmployees && assignedEmployees.length > 0) {
                // Map through employees and join their names with commas
                const employeeNames = assignedEmployees.map(emp => `${emp.name} ${emp.surname}`).join(', ');
                const employeeNamesWithTooltip = (
                    <Tooltip title={employeeNames} arrow>
                        <Typography variant="body2" noWrap>{employeeNames}</Typography>
                    </Tooltip>
                );
                // Push the row data with employee names joined by commas
                rows.push({
                    id: goal.id,
                    name: goal.name,
                    categoryDescription: goal.categoryDescription,
                    statusDescription: goal.statusDescription,
                    assignedEmployees: employeeNames, // Comma separated employee names
                    goalId: goal.id,
                });
                
            }
        });
        return rows;
    };
    

    const columns: GridColDef<Goal>[] = [

         
        { field: "assignedEmployees", headerName: "Priradený zamestnanec", width: 200 },
        { field: "name", headerName: "Názov cieľa", width: 150 },
        { field: "categoryDescription", headerName: "Kategória cieľa", width: 150 },
        { field: "statusDescription", headerName: "Stav cieľa", width: 150 },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            renderCell: (params) => (
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'orange', color: 'black', fontSize: '12px', textWrap: "wrap" }}
                        onClick={() => handleEdit(params.row.id, params.field)}
                    >   
                        Editovať
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
                    Ciele a rozvoj môjho tímu
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => nav("/newGoal")}
                >
                    Vytvoriť nový cieľ
                </Button>
                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={generateRows(goalRows)}
                        onRowClick={handleRowClick}
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

                {/* Goal Details Modal */}
                <Dialog open={openGoalDetailsDialog} onClose={handleCloseGoalDetailsDialog}>
                    <DialogTitle>Detail cieľa</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">Názov cieľa: {selectedGoal?.name}</Typography>
                        <Typography variant="body1">Kategória cieľa: {selectedGoal?.categoryDescription}</Typography>
                        <Typography variant="body1">Stav cieľa: {selectedGoal?.statusDescription}</Typography>
                        <Typography variant="body1">Priradení zamestnanci: {selectedGoal?.assignedEmployees?.join(', ') || 'Žiadny zamestnanec'}</Typography>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseGoalDetailsDialog} color="primary">
                            Zatvoriť
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default ManageGoals;
