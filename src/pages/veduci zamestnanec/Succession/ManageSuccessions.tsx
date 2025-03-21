import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography, Snackbar, Stack, Tooltip } from "@mui/material";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import { Alert, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Divider, Tabs, Tab  } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from "@mui/system";
import SuccessionPlan from "../../../types/SuccessionPlan";
import DeleteDialog from "../../../components/DeleteDialog";

type GroupedSuccessionPlans = {
    leaveTypeName: string;
    successionPlans: SuccessionPlan[];
};

const colorMap: Record<string, string> = {
    "Kritický odchod": "#EC6602",
    "Plánovaný odchod": "#009999",
    "Redundancia týmu": "#616366",
  };


const columnConfig: Record<string, string[]> = {
    "Kritický odchod": [
    "Meno a priezvisko", "Súčasná pozícia", "Oddelenie", "Dôvod odchodu", "Dátum odchodu",
    "Nástupca", "Pozícia nástupcu", "Oddelenie nástupcu", "Pripravenosť", "Akcia"
    ],
    "Plánovaný odchod": [
    "Meno a priezvisko", "Súčasná pozícia", "Oddelenie", "Dôvod odchodu", "Dátum odchodu",
    "Nástupca", "Pozícia nástupcu", "Oddelenie nástupcu", "Pripravenosť", "Akcia"
    ],
    "Redundancia týmu": [
    "Meno a priezvisko", "Súčasná pozícia", "Oddelenie", "Dôvod odchodu", "Dátum odchodu"
    ]
};

const ManageSuccessions: React.FC = () => {
    const [successionPlans, setSuccessionPlans] = useState<GroupedSuccessionPlans[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<SuccessionPlan | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const nav = useNavigate();

    useEffect(() => {
        api.get("/Succession/GetSuccessionPlans")
            .then((res) => {
                console.log("Received plans:", res.data);
                //setSuccessionPlans(Array.isArray(res.data) ? res.data : []);
                setSuccessionPlans(res.data);
            })
            .catch((err) => {
                
                console.error(err);
            });
    }, []);


    const getDate = (date: any) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("sk-SK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const CustomTabs = styled(Tabs)({
        borderBottom: "1px solid #e0e0e0", 
        minHeight: "auto",
        "& .MuiTabs-indicator": {
            backgroundColor: "#008080", 
            height: "3px",
        },
    });
    
    const CustomTab = styled(Tab)({
        textTransform: "none", // Keep original casing
        minWidth: 0,
        minHeight: "auto",
        fontWeight: 500,
        fontSize: "14px",
        "&.Mui-selected": {
            color: "#000000", // Selected tab text color
        },
        "&:not(.Mui-selected)": {
            color: "#555555", // Unselected tab text color (grayish)
        },
        "&:not(:last-of-type)": {
            borderRight: "1px solid #e0e0e0", // Light gray line
        },
    });

    const handleEdit = (plan: SuccessionPlan) => {
        const id = plan.id;
        nav('/editSuccession', { state: { id } });
    };
    
    const handleDelete = (plan: SuccessionPlan) => {
        console.log("Delete plan", plan);
        setSelectedPlanId(plan);
        setDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedPlanId) {
            try {
                await api.delete(`/Succession/Delete/${selectedPlanId.id}`);
                setSuccessionPlans((prevGroups) =>
                    prevGroups.map((group) => ({
                        ...group,
                        successionPlans: group.successionPlans.filter(
                            (plan) => plan.id !== selectedPlanId.id
                        ),
                    }))
                );
                setSnackbarOpen(true);
            } catch (err: any) {
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.message);
                    setSnackbarOpen(true);
                } else {
                    console.error("Error deleting plan:", err);
                }
            } finally {
                setDialogOpen(false);
                setSelectedPlanId(null);
            }
        }
    };

    const renderCell = (col: string, plan: SuccessionPlan) => {
        switch (col) {
          case "Meno a priezvisko":
            return plan.leavingFullName;
          case "Súčasná pozícia":
            return plan.leavingJobPosition;
          case "Oddelenie":
            return plan.leavingDepartment;
          case "Dôvod odchodu":
            return plan.reason;
          case "Dátum odchodu":
            return getDate(plan.leaveDate);
          case "Nástupca":
            return plan.successorFullName;
          case "Pozícia nástupcu":
            return plan.successorJobPosition;
          case "Oddelenie nástupcu":
            return plan.successorDepartment;
          case "Pripravenosť":
            return plan.readyStatus;
          case "Akcia":
            return (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleEdit(plan)}
                  sx={{
                    backgroundColor: '#BA4400',
                    textTransform: 'none', 
                    '&:hover': {
                      backgroundColor: '#A53D00', 
                    },
                  }}
                >
                  Editovať
                </Button>
                <Box
                    sx={{
                        height: 24, 
                        width: '1px',
                        backgroundColor: 'black',
                        alignSelf: 'center'
                    }}
                />
                <Tooltip title="Odstrániť">
                  <IconButton color="error" onClick={() => handleDelete(plan)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          default:
            return null;
        }
      };
      

    
    const SuccessionTable: React.FC<{ leaveType: string; plans: SuccessionPlan[] }> = ({ leaveType, plans }) => {
        const color = colorMap[leaveType] || "#000";
        const columns = columnConfig[leaveType];
        
        return (
            <Box sx={{width: leaveType === "Redundancia týmu" ? "50%" : "100%", marginBottom: 4 }}>
                <Typography variant="h6" sx={{ color }}>
                    {leaveType}
                </Typography>
                <Table  sx={{ borderCollapse: "separate", borderSpacing: "0 4px" }}>
                    <TableHead>
                        <TableRow>{columns.map((col) => (
                            <TableCell key={col} 
                            sx={{
                                width: `${100 / columns.length}%`,
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontStyle: "italic"
                              }}
                            >{col}</TableCell>))}
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                        {plans.length > 0 ? (
                        plans.map((plan, index) => (
                            <TableRow 
                                key={index} 
                                sx={{ backgroundColor: "#fff", 
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}>
                
                            {columns.map((col, idx) => (
                                <TableCell key={idx} sx={{
                                    borderLeft: col === "Meno a priezvisko" ? "6px solid  " + color: undefined,
                                    borderRight: col === "Dátum odchodu" ? "6px solid  " + color: undefined,
                                  }}>
                                    {renderCell(col, plan)}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ fontStyle: "italic", color: "#999" }}>
                                Žiadne dáta
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        );
    };

    return (
        
        <Layout >
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Zoznam nastupíckych zamestnancov 
                </Typography>

                {/* Tabs */}
                <CustomTabs value={activeTab} onChange={handleTabChange} sx={{ marginBottom: 3 }}>
                    <CustomTab label="Hlavný zoznam" />
                    <CustomTab label="Personalizovaný plán" />
                </CustomTabs>

                {activeTab === 0 && (
                    <>
                        {/*  Hlavný zoznam */}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginBottom: 2 }}
                            onClick={() => nav("/newSuccession")}
                        >
                            Pridať
                        </Button>
                    
                        {["Kritický odchod", "Plánovaný odchod", "Redundancia týmu"].map((type) => (
                            <SuccessionTable key={type} leaveType={type} plans={successionPlans.find(g => g.leaveTypeName === type)?.successionPlans || []} />
                        ))}
                    </>
                )}

                {activeTab === 1 && (
                    <>
                        {/* Personalizovaný plán */}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginBottom: 2 }}
                            onClick={() => {
                                // TODO
                            }}
                        >
                            Hľadať zamestnanca
                        </Button>

                        
                        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                            Personalizovaný plán zamestnanca: <strong>{selectedEmployee}</strong>
                        </Typography>
                        
                        
                    </>
                )}

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
        </Layout>
        
    );
};


export default ManageSuccessions;
