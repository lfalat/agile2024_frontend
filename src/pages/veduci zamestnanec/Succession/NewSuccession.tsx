import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import {Autocomplete, Box, Stack, TextField, Typography, Button, Alert, TextareaAutosize, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
import { DataGridPro} from "@mui/x-data-grid-pro";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from '../../../hooks/SnackBarContext';
import UserProfile from "../../../types/UserProfile";
import EmployeeCardDialog from "../../spravca/Users/EmployeCardDialog";
import { Department } from "../../../types/Department";
import { useAuth } from "../../../hooks/AuthProvider";

const schema = z.object({
    leavingId: z.string(),
    leaveReason: z.string(), 
    leaveDate: z.string(),
    successorId: z.string(),
    readyStatus: z.string()
});

type FormData = z.infer<typeof schema>;

const NewSuccession: React.FC = () => {
    const nav = useNavigate();
    const { openSnackbar } = useSnackbar();
    const { userProfile } = useAuth();
    const [error, setError] = useState<string>();
    const [openModal, setOpenModal] = useState(false);
    
    const [leavingId, setLeavingId] = useState<string[]>([]);
    const [leaveReason, setLeaveReason] = useState<string[]>([]);
    const [leaveDate, setLeaveDate] = useState<Dayjs | null>(dayjs());
    const [successorId, setSuccessorId] = useState<string[]>([]);
    const [readyStatus, setEeadyStatus] = useState<string[]>([]);

   const {
            register,
            handleSubmit,
            setValue,
            formState: { errors },
        } = useForm<FormData>({
            resolver: zodResolver(schema),
           
        });

    
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const senderId = userProfile?.id;
        const dataToSend = {
            leavingId,
            leaveReason, 
            leaveDate: leaveDate?.toISOString(),
            successorId,
            readyStatus
        };

        await api.post("/Succession/CreateSuccession", dataToSend)
            .then((res) => {
                console.log(" created:", res.data);
                openSnackbar("Nástupníctvo bolo úspešne vytvorené", "success");
                nav('/manageSuccessions');
            })
            .catch((err) => {
                setError(err.response.data.title);
                console.error("Error creating:", err);
            });
    };
    

   
        return (
            <Layout>
                <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Odstupujúci zamestnanec
                    </Typography>

                    <Button variant="contained" color="primary" sx={{ marginY: 2 }} onClick={() => setOpenModal(true)}>
                        Pridať zamestnanca
                    </Button>

                    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                        <DialogTitle>
                            Pridať zamestnanca s plánovaným odchodom
                            <Stack direction="row" spacing={2} sx={{ float: "right" }}>
                                <Button color="primary">
                                    Zoznam zamestnancov
                                </Button>
                            </Stack>
                        </DialogTitle>
                    </Dialog>

                    <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)}>
                    
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                            label="Termín odchodu zamestnanca *"
                            value={leaveDate}
                            {...register('leaveDate', { required: 'Termín je povinný.' })}
                            onChange={setLeaveDate}
                            //renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                                  
                        </LocalizationProvider>
                        <Stack direction="row" gap={3}>
                            <Button type="submit" variant="contained" color="primary">
                                Vytvoriť
                            </Button>
                            <Button type="button" variant="contained" color="secondary" onClick={() => nav('/manageLocations')}>
                                Zrušiť
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Layout>
        );
    
};

export default NewSuccession;