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

const colorMap: Record<string, string> = {
    "Kritický odchod": "#FF7F0E",
    "Plánovaný odchod": "#17BECF",
    "Redundancia týmu": "#A9A9A9",
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
                  color="warning"
                  size="small"
                  onClick={() => handleEdit(plan)}
                >
                  Editovať
                </Button>
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
                <Typography variant="h6" sx={{ color, fontWeight: "bold" }}>
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
                                textOverflow: "ellipsis"
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
                                    borderLeft: col === "Meno a priezvisko" ? "2px solid  " + color: undefined,
                                    borderRight: col === "Dátum odchodu" ? "2px solid  " + color: undefined,
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
            </Box>
        </Layout>
        
    );
};


export default ManageSuccessions;
