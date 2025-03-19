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
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { DataGrid} from "@mui/x-data-grid";
import { useSnackbar } from '../../../hooks/SnackBarContext';
import UserProfile from "../../../types/UserProfile";
import EmployeeCardDialog from "../../spravca/Users/EmployeCardDialog";
import { Department } from "../../../types/Department";
import { useAuth } from "../../../hooks/AuthProvider";
type LeaveType = {
  id: string,
  description: string;
};

type ReadyStatus = {
    id: string,
    description: string;
  };
const schema = z.object({
    leavingId: z.string(),
    leaveReason: z.string().min(1, "Dôvod odchodu je povinný."), 
    leaveType: z.string(), 
    leaveDate: z.string().min(1, "Dátum je povinný."),
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
    const [leaveType, setLeaveType] = useState<string[]>([]);
    const [leaveDate, setLeaveDate] = useState<Dayjs | null>(dayjs());
    const [successorId, setSuccessorId] = useState<string[]>([]);
    const [readyStatus, setEeadyStatus] = useState<string[]>([]);
    const [leaveTypesOptions, setleaveTypesOptions] = useState<{ id: string; label: string }[]>([]);
    const [readyStatusesOptions, setReadyStatusesOptions] = useState<{ id: string; label: string }[]>([]);
    const [leavingEmployeeOptions, setLeavingEmployeeOptions] = useState<EmployeeCard[]>([]);


   const {
            register,
            handleSubmit,
            setValue,
            formState: { errors },
        } = useForm<FormData>({
            resolver: zodResolver(schema),
           
        });

        useEffect(() => {
            api.get(`/Succession/GetLeaveTypes/`)
            .then((res) => {
                const options = res.data.map((leaveType:LeaveType) => ({
                    id: leaveType.id,
                    label: leaveType.description,
                }));
                setleaveTypesOptions(options);
            })
            .catch((err) => console.error(err));


            api.get(`/Succession/GetReadyStatuses/`)
            .then((res) => {
                const options = res.data.map((leaveType:ReadyStatus) => ({
                    id: leaveType.id,
                    label: leaveType.description,
                }));
                setReadyStatusesOptions(options);
            })
            .catch((err) => console.error(err));

            api.get(`/EmployeeCard/GetEmployeesInTeam/`)
            .then((res) => {
                setLeavingEmployeeOptions(res.data); 
                console.log("employeeCards", res.data); 
            })
            .catch((err) => console.error(err));
            }, []);
    
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
    

    const columnsUser: GridColDef<EmployeeCard>[] = [
            { field: "employeeId", headerName: "ID zamestnanca", width: 150 },
            { 
                field: "surname", 
                headerName: "Meno zamestnanca", 
                width: 150, 
                renderCell: (params: any) => (
                    <span>{params.row.name} {params.row.surname}</span> // Kombinovanie mena a priezviska
                )
            },
            { field: "department", headerName: "Oddelenie", width: 150 },
            {
                        field: "actions",
                        headerName: "Akcie",
                        width: 200,
                        renderCell: (params: any ) => (
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "turquoise", color: "black", fontSize: "12px", textWrap: "wrap" }}
                                    /*disabled={employeeIds.includes(params.row.employeeId)}
                                    onClick={() => handleAddEmployee(params.row.employeeId)} */
                      
                                >
                                    Vybrať
                                </Button>
                   
                                
                            </Stack>
                        ),}
            
        ];
   
        return (
            <Layout>
                <Box sx={{ padding: 3, display: "flex", gap: 20 }}>
                
                {/* ĽAVÁ STRANA */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                            <Box sx={{ height: 400, width: "100%", marginBottom: 3 }}>
                                                     <DataGridPro
                                                    columns={columnsUser}
                                                    rows={leavingEmployeeOptions}
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
                                                    getRowId={(row) => row.employeeId}     
                                                    onCellClick={(params) => {
                                                        /*if (params.field === "name" || params.field === "surname") {
                                                            handleEmployeeCardClick(params.row.employeeId);
                                                        }*/
                                                    }}
                                                />
                                                </Box>
                        </DialogTitle>
                    </Dialog>

                    <Typography variant="body1"  gutterBottom sx={{ marginBottom: 3 }}>
                            Pridaný zamestnanec: 
                    </Typography>

                    <Stack direction="column"  gap={2} sx={{ width: "70%"  }} component="form" onSubmit={handleSubmit(onSubmit)}>
                    
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                            label="Termín odchodu zamestnanca *"
                            value={leaveDate}
                            {...register('leaveDate', { required: 'Termín je povinný.' })}
                            onChange={setLeaveDate}
                            
                            //renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                                  
                        </LocalizationProvider>
                        <TextField label="Dôvod odchodu" required fullWidth {...register("leaveReason")} error={!!errors.leaveReason} helperText={errors.leaveReason?.message ?? ""}></TextField>
                        <Autocomplete
                            fullWidth
                            options={leaveTypesOptions}
                            onChange={(e, value) => setValue("leaveType", value?.id ?? "")}
                            renderInput={(params) => <TextField {...params} label="Typ odchodu" error={!!errors.leaveType} helperText={errors.leaveType?.message ?? ""} required/>}
                        />
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

                    {/* PRAVÁ STRANA */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", borderLeft: "2px solid #ddd", paddingLeft: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom >
                        Nastupujúci zamestnanec
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ display: "flex", flexDirection: "row", marginY: 2 }}>
                        <Button variant="contained" sx={{ backgroundColor: '#008B8B', '&:hover': { backgroundColor: '#0097A7' }, color: 'white', padding: '8px 16px' }}>
                            Interný zamestnanec
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#008B8B', '&:hover': { backgroundColor: '#0097A7' }, color: 'white', padding: '8px 16px' }}>
                            Externý zamestnanec
                        </Button>
                    </Stack>

                    <Typography variant="body1"  gutterBottom sx={{ marginBottom: 3 }}>
                            Pridaný zamestnanec: 
                    </Typography>

                    <Autocomplete
                            fullWidth
                            options={readyStatusesOptions}
                            onChange={(e, value) => setValue("leaveType", value?.id ?? "")}
                            renderInput={(params) => <TextField {...params} label="Pripravenosť zamestnanca" error={!!errors.leaveType} helperText={errors.leaveType?.message ?? ""} required/>}
                        />

                </Box>
                </Box>
            </Layout>
        );
    
};

export default NewSuccession;


