import React, { useState } from "react";
import Layout from "../../../components/Layout";
import {Autocomplete, Box, Stack, TextField, Typography, Button, Alert, TextareaAutosize } from "@mui/material";
import { z } from "zod";
import {useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../app/api";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { EmployeeCard } from "../../../types/EmployeeCard";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useSnackbar } from '../../../hooks/SnackBarContext';
import UserProfile from "../../../types/UserProfile";
import EmployeeCardDialog from "../../spravca/Users/EmployeCardDialog";

const NewReview: React.FC = () => {
    const nav = useNavigate();
    const [error, setError] = useState<string>();
    const [dueDate, setDueDate] = React.useState<Dayjs | null>(dayjs('2024-11-09'));
    const [employeeData, setEmployeeData] = useState<EmployeeCard[]>([]);
    const [employeeIds, setEmployeeIds] = useState<string[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [employeeDeadline, setEmployeeDeadline] = useState<Dayjs | null>(dayjs());
    const [managerDeadline, setManagerDeadline] = useState<Dayjs | null>(dayjs());
    const { openSnackbar } = useSnackbar();


    const handleEmployeeSelection = (employees: string[]) => {
        setSelectedEmployees(employees);
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const dataToSend = {
            ...data,  
            employeeIds: employeeIds, 
        };
       await api.post("/Goal/Create", dataToSend)
            .then((res) => {
                console.log("Goal sending:",dataToSend);
                console.log("Goal created:", res.data);
                openSnackbar("Organizácia bola úspešne vytvorená", "success");
                nav('/manageGoals');
            })
            .catch((err) => {
                setError(err.response.data.title);
                console.error(err);
            });
    };

    const handleAddEmployee = (employeeId: string) => {
        if (!employeeIds.includes(employeeId)) {
            const updated = [...employeeIds, employeeId];
            setEmployeeIds(updated);
            //setValue("employeeIds", updated); // Aktualizácia pre validáciu
        }
    };
    
    const handleRemoveEmployee = (employeeId: string) => {
        const updated = employeeIds.filter((id) => id !== employeeId);
        setEmployeeIds(updated);
        //setValue("employeeIds", updated); // Aktualizácia pre validáciu
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Vytvoriť posudok
                </Typography>
                <Typography>Názov: Posudok ????</Typography>
                
                <Button variant="contained" color="primary" sx={{ marginY: 2 }} onClick={() => setOpenModal(true)}>
                    Pridať zamestnanca
                </Button>

                {selectedEmployees.length > 0 && (
                    <Typography>
                        Pridaný zamestnanec: {selectedEmployees.join(", ")}
                    </Typography>
                )}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ width: "100%", marginTop: 2 }}>
                        <DateTimePicker
                            label="Termín dopytovaného zamestnanca *"
                            value={employeeDeadline}
                            onChange={setEmployeeDeadline}
                            //renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <DateTimePicker
                            label="Termín vedúceho zamestnanca *"
                            value={managerDeadline}
                            onChange={setManagerDeadline}
                            //renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Stack>
                </LocalizationProvider>

                <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
                    <Button type="submit"  variant="contained" color="primary">
                        Vytvoriť
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={() => nav('/manageReviews')}>
                        Zrušiť
                    </Button>
                </Stack>
            </Box>
        </Layout>
    );
};

export default NewReview;