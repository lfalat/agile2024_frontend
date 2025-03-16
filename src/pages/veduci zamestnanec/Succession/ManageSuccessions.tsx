import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Typography, Snackbar, Stack, Tooltip } from "@mui/material";
import api from "../../../app/api";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SuccessionPlan from "../../../types/SuccessionPlan";

type GroupedSuccessionPlans = {
    leaveTypeName: string;
    successionPlans: SuccessionPlan[];
};

type SuccessionTableProps = {
    leaveType: string;
    plans: SuccessionPlan[];
};

const ManageSuccessions: React.FC = () => {
    const [successionPlans, setSuccessionPlans] = useState<GroupedSuccessionPlans[]>([]);
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

    const handleEdit = (plan: SuccessionPlan) => {
        console.log("Edit plan", plan);
        nav(`/editSuccession/${plan.id}`); 
        //TODO
    };
    
    const handleDelete = (plan: SuccessionPlan) => {
        console.log("Delete plan", plan);
        //TODO 
    };

    type SuccessionTableProps = {
        leaveType: string;
        plans: SuccessionPlan[];
    };
    
    const SuccessionTable: React.FC<SuccessionTableProps> = ({ leaveType, plans }) => {
        return (
            <Box sx={{ width: "100%", marginBottom: 4 }}>
                <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
                    {leaveType} {/* Example: Kritický odchod */}
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Table sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Meno a priezvisko</TableCell>
                            <TableCell>Súčasná pozícia</TableCell>
                            <TableCell>Oddelenie</TableCell>
                            <TableCell>Dôvod odchodu</TableCell>
                            <TableCell>Dátum odchodu</TableCell>
                            <TableCell>Nástupca</TableCell>
                            <TableCell>Súčasná pozícia</TableCell>
                            <TableCell>Oddelenie</TableCell>
                            <TableCell>Pripravenosť</TableCell>
                            <TableCell>Akcia</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan, index) => (
                            <TableRow key={index} sx={{
                                backgroundColor: "#fff",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                "& td": {
                                    borderBottom: "none"
                                }
                            }}>
                                <TableCell>{plan.leavingFullName}</TableCell>
                                <TableCell>{plan.leavingJobPosition}</TableCell>
                                <TableCell>{plan.leavingDepartment}</TableCell>
                                <TableCell>{plan.reason}</TableCell>
                                <TableCell>{getDate(plan.leaveDate)}</TableCell>
                                <TableCell>{plan.successorFullName}</TableCell>
                                <TableCell>{plan.successorJobPosition}</TableCell>
                                <TableCell>{plan.successorDepartment}</TableCell>
                                <TableCell>{plan.readyStatus}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEdit(plan)}
                                        >
                                            Editovať
                                        </Button>
                                        <Tooltip title="Odstrániť">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(plan)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        );
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Zoznam nastupíckych zamestnancov 
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => nav("/newSuccession")}
                >
                    Pridať
                </Button>
               
                {successionPlans.map((group, index) => (
                <SuccessionTable
                    key={index}
                    leaveType={group.leaveTypeName} // Kritický odchod etc.
                    plans={group.successionPlans}
                />
            ))}
            </Box>
        </Layout>
    );
};


export default ManageSuccessions;
