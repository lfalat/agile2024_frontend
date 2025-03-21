import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import {Autocomplete, Box, Stack, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, LinearProgress } from "@mui/material";
import { z } from "zod";
import {useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../app/api";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { EmployeeCard } from "../../../types/EmployeeCard";
import { useSnackbar } from '../../../hooks/SnackBarContext';
import { useAuth } from "../../../hooks/AuthProvider";
import UserProfile from "../../../types/UserProfile";

import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
//import { DataGrid} from "@mui/x-data-grid";
import EmployeeCardDialog from "../../spravca/Users/EmployeCardDialog";

const schema = z.object({
    leavingId: z.string(),
    leaveReason: z.string().min(1, "Dôvod odchodu je povinný."), 
    leaveType: z.string(), 
    leaveDate: z.string(),
    successorId: z.string().nullable(),
    readyStatus: z.string()
});


type LeaveType = {
  id: string,
  description: string;
};

type ReadyStatus = {
    id: string,
    description: string;
};


type FormData = z.infer<typeof schema>;

const EditSuccession: React.FC = () => {
    const { id } = useParams(); // Get succession ID from route
    const nav = useNavigate();
    const { openSnackbar } = useSnackbar();
    const { userProfile } = useAuth();

    const [leaveReason, setLeaveReason] = useState<string>("");
    const [leaveType, setLeaveType] = useState<string>("");
    const [error, setError] = useState<string>();
    const [openModal, setOpenModal] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [leaveDate, setLeaveDate] = useState<Dayjs | null>(dayjs());
    const [leaveTypesOptions, setLeaveTypesOptions] = useState<{ id: string; label: string }[]>([]);
    const [readyStatusesOptions, setReadyStatusesOptions] = useState<{ id: string; label: string }[]>([]);
    const [leavingEmployeeOptions, setLeavingEmployeeOptions] = useState<EmployeeCard[]>([]);
    const [successorOptions, setSuccessorOptions] = useState<EmployeeCard[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [selectedSuccessor, setSelectedSuccessor] = useState<string | null>(null);
    const [fields, setFields] = useState<{ text: string, checked: boolean }[]>([]);
    const [isNotified, setIsNotified] = useState(false);
    const [modalType, setModalType] = useState<'leaving' | 'successor' | null>(null);
    const [selectedEmployeeCard, setSelectedEmployeeCard] = useState<UserProfile | null>(null); 
    
       

   const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    
    });

          // Fetch dropdown options (leaveTypes, readyStatuses, employees)
    useEffect(() => {
        api.get(`/Succession/GetLeaveTypes/`).then(res => {
            setLeaveTypesOptions(res.data.map((x: any) => ({ id: x.id, label: x.description })));
        });
        api.get(`/Succession/GetReadyStatuses/`).then(res => {
            setReadyStatusesOptions(res.data.map((x: any) => ({ id: x.id, label: x.description })));
        });
        api.get(`/EmployeeCard/GetEmployeesInTeam/`).then(res => {
            setLeavingEmployeeOptions(res.data);
        });
        api.get(`/EmployeeCard/GetEmployeesWithouSuperiors/`).then(res => {
            setSuccessorOptions(res.data);
        });
    }, []);


    useEffect(() => {
        if (!id) return;
        api.get(`/Succession/GetById/${id}`).then(res => {
          const succession = res.data;
    
          // Prefill form fields
          setValue('leavingId', succession.leavingId);
          setSelectedEmployee(succession.leavingId);
    
          setValue('leaveReason', succession.leaveReason);
          setValue('leaveType', succession.leaveType);
          setValue('leaveDate', succession.leaveDate);
          setLeaveDate(dayjs(succession.leaveDate));
    
          setValue('successorId', succession.successorId);
          setSelectedSuccessor(succession.successorId);
    
          setValue('readyStatus', succession.readyStatus);
    
          setFields(succession.skills || []);
          setIsNotified(succession.isNotified);
        }).catch(err => {
          console.error(err);
          openSnackbar("Nepodarilo sa načítať údaje o nástupníctve.", "error");
        });
      }, [id, setValue, openSnackbar]);

    
    const onSubmit: SubmitHandler<FormData> = async (data) => {        
        const skillsData = fields.map(field => ({
            description: field.text,
            isReady: field.checked
        }));

        const dataToSend = {
            ...data,
            skills: skillsData,
            isNotified: isNotified,
        };

        console.log("Updating succession: ", dataToSend);
        
        await api.post(`/Succession/Update/${id}`, dataToSend)
            .then((res) => {
                console.log("Updated:", res.data);
                openSnackbar("Nástupníctvo bolo úspešne aktualizované", "success");
                nav('/manageSuccessions');
            })
            .catch((err) => {
                setError(err.response.data.title);
                console.error("Error updating:", err);
            });
    };

    const openEmployeeModal = (type: 'leaving' | 'successor') => {
        setModalType(type);
        setOpenModal(true);
    };
    
    const handleSelectEmployee = (employeeId: string) => {
        if (modalType === 'leaving') {
            setSelectedEmployee(employeeId);
            setValue('leavingId', employeeId ?? "");
        } else if (modalType === 'successor') {
            setSelectedSuccessor(employeeId);
            setValue('successorId', employeeId ?? "");
            console.log("successor:", selectedSuccessor)
        }
        setOpenModal(false);
    };
    useEffect(() => {
        console.log("Aktualizovaný successor:", selectedSuccessor);
    }, [selectedSuccessor]);
    const setExternist = () => {
        setSelectedSuccessor(null); 
        setSelectedSuccessor('externist');
        setValue('successorId', null);
    };
    
    // pridava pole pre zručnosti a checkbox
    const handleAddField = () => {
        setFields([...fields, { text: "", checked: false }]);
    };

    // zmena textu pri zručnostiach
    const handleTextChange = (index: number, value: string) => {
        const newFields = [...fields];
        newFields[index].text = value;
        setFields(newFields);
    };

    // zmena v checkboxe
    const handleCheckboxChange = (index: number, checked: boolean) => {
        const newFields = [...fields];
        newFields[index].checked = checked;
        setFields(newFields);
    };

    const handleEmployeeCardClick = async (employeeCardId: string) => {
            const response = await api.get(`/EmployeeCard/GetUserByEmployeeCard?employeeCardId=${employeeCardId}`);
            const userProfile: UserProfile = response.data; 
    
            setSelectedEmployeeCard(userProfile);
            //setSelectedEmployee(employee);
            setOpenCardDialog(true); // Show employee card dialog
        };

    const completedTasks = fields.filter(field => field.checked).length;
    const totalTasks = fields.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const selectedEmployeeObj = leavingEmployeeOptions.find(emp => emp.employeeId === selectedEmployee);
    const selectedSuccessorObj = successorOptions.find(emp => emp.employeeId === selectedSuccessor);
    const rows = modalType === 'successor' ? successorOptions : leavingEmployeeOptions;

    const columnsUser: GridColDef<EmployeeCard>[] = [
            { field: "employeeId", headerName: "ID zamestnanca", width: 150 },
            { field: "surname", headerName: "Meno zamestnanca", width: 150, renderCell: (params: any) => (<span>{params.row.name} {params.row.surname}</span>)},
            { field: "department", headerName: "Oddelenie", width: 150 },
            {
                        field: "actions",
                        headerName: "Akcie",
                        width: 200,
                        renderCell: (params: any ) => (
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "turquoise", color: "black", fontSize: "12px", textWrap: "wrap" }}
                                disabled={selectedEmployee == params.row.employeeId || selectedSuccessor == params.row.employeeId}
                                onClick={() => handleSelectEmployee(params.row.employeeId)} >
                                Vybrať
                            </Button>
                            
                        ),}          
        ];
   
        return (
            <Layout>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Editovať nástupníctvo</Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ padding: 3, display: "flex", gap: 20 }} >               
                {/* ĽAVÁ STRANA */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom> Odstupujúci zamestnanec </Typography>

                    <Button variant="contained" color="primary" onClick={() => openEmployeeModal('leaving')} sx={{ float: "right", marginTop:2 }}>
                        Pridať zamestnanca
                    </Button>

                    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                        <DialogTitle>
                            {modalType === 'leaving' ? 'Pridať odstupujúceho zamestnanca' : 'Pridať nastupujúceho zamestnanca'}
                            <Stack direction="row" spacing={2} sx={{ float: "right"}}>
                                <Button color="primary" >
                                    Zoznam zamestnancov
                                </Button>
                            </Stack>
                            <Box sx={{ height: 400, width: "100%", marginBottom: 3 }}>
                                <DataGridPro
                                    columns={columnsUser}
                                    rows={rows}
                                    initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 6,
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

                    <Typography variant="body1"  gutterBottom sx={{ marginBottom: 3, marginTop: 2}} onClick={() => {
                        if (selectedEmployeeObj) {
                            handleEmployeeCardClick(selectedEmployeeObj.employeeId);
                        }
                    }}>
                        Pridaný zamestnanec: 
                        {leavingEmployeeOptions.find(emp => emp.employeeId === selectedEmployee) 
                            ? `${leavingEmployeeOptions.find(emp => emp.employeeId === selectedEmployee)?.name} ${leavingEmployeeOptions.find(emp => emp.employeeId === selectedEmployee)?.surname}`
                            : ""}
                    </Typography>

                    <Stack direction="column"  gap={2} sx={{ width: "70%"  }} component="form">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Termín odchodu zamestnanca *"
                                value={leaveDate}
                            
                                onChange={(newDate) => {
                                    const formattedDate = dayjs(newDate).format('YYYY-MM-DD');
                                    setValue('leaveDate', formattedDate);
                                    setLeaveDate(newDate); 
                            }}
                            />                                  
                        </LocalizationProvider>
                        <TextField label="Dôvod odchodu" 
                            required
                            fullWidth 
                            {...register("leaveReason")} 
                            error={!!errors.leaveReason} 
                            helperText={errors.leaveReason?.message ?? ""}
                            value={leaveReason}
                            onChange={(e) => {
                                setLeaveReason(e.target.value);
                                setValue("leaveReason", e.target.value);
                            }}
                            >

                        </TextField>
                        <Autocomplete
                            fullWidth
                            options={leaveTypesOptions}
                            onChange={(e, value) => {
                                setLeaveType(value?.label ?? "");
                                setValue("leaveType", value?.id ?? "")
                            }}
                            renderInput={(params) => <TextField {...params} label="Typ odchodu" 
                            />}
                        />
                        
                        {selectedEmployeeObj && (
                            <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#f5f5f5", borderRadius: "8px", width: "150%"  }}>
                                {leavingEmployeeOptions.find(emp => emp.employeeId === selectedEmployee) ? (
                                    <> 
                                    <Typography variant="body2"><b>Súčasná pozícia:</b> {selectedEmployeeObj.jobPosition}</Typography>
                                    <Typography variant="body2"><b>Dátum odchodu:</b> {leaveDate?.toString()}</Typography>
                                    <Typography variant="body2"><b>Oddelenie:</b> {selectedEmployeeObj.department}</Typography>
                                    <Typography variant="body2"><b>Organizácia:</b> {selectedEmployeeObj.organization}</Typography>
                                    <Typography variant="body2"><b>Dôvod odchodu:</b> {leaveReason}</Typography>
                                    <Typography variant="body2"><b>Typ odchodu:</b> {leaveType}</Typography>
                                    </>
                                ) : (
                                    <Typography variant="body2">Nie sú dostupné žiadne informácie.</Typography>
                                )}
                            </Box>
                        )}
                    </Stack>
                </Box>

                    {/* PRAVÁ STRANA */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", borderLeft: "2px solid #ddd", paddingLeft: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom > Nastupujúci zamestnanec </Typography>

                    <Stack direction="row" spacing={2} sx={{ display: "flex", flexDirection: "row", marginY: 2 }}>
                        <Button variant="contained" color="info" onClick={() => openEmployeeModal('successor')}>
                            Interný zamestnanec
                        </Button>
                        <Button variant="contained" color="info" onClick={() => setExternist()}>
                            Externý zamestnanec
                        </Button>
                    </Stack>                   

                    <Typography variant="body1"  gutterBottom sx={{ marginBottom: 2 }} onClick={() => {
                        if (selectedSuccessorObj) {
                            handleEmployeeCardClick(selectedSuccessorObj.employeeId);
                        }
                    }}>
                        Pridaný zamestnanec: 
                        {selectedSuccessor === 'externist' 
                            ? "Externý zamestnanec"
                            : successorOptions.find(emp => emp.employeeId === selectedSuccessor)
                            ? `${successorOptions.find(emp => emp.employeeId === selectedSuccessor)?.name} ${successorOptions.find(emp => emp.employeeId === selectedSuccessor)?.surname}`
                            : ""}
                    </Typography>

                    <Autocomplete
                        fullWidth
                        options={readyStatusesOptions}
                        onChange={(e, value) => setValue("readyStatus", value?.id ?? "")}
                        renderInput={(params) => <TextField {...params} label="Pripravenosť zamestnanca" 
                        error={!!errors.readyStatus} helperText={errors.readyStatus?.message ?? ""} required
                        />}                            
                    />

                    {selectedSuccessor && selectedSuccessor !== 'externist' && (
                        <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#f5f5f5", borderRadius: "8px"}}>                               
                            {leavingEmployeeOptions.find(emp => emp.employeeId === selectedSuccessor) ? (
                                <>
                                <Typography variant="body2"><b>Súčasná pozícia:</b> {selectedSuccessorObj?.jobPosition}</Typography>
                                <Typography variant="body2"><b>Dátum odchodu:</b> {leaveDate?.toString()}</Typography>
                                <Typography variant="body2"><b>Oddelenie:</b> {selectedSuccessorObj?.department}</Typography>
                                <Typography variant="body2"><b>Organizácia:</b> {selectedSuccessorObj?.organization}</Typography>
                                <Typography variant="body2"><b>Pripravenosť :</b> {leaveReason}</Typography>
                                </>
                            ) : (
                                <Typography variant="body2">Nie sú dostupné žiadne informácie.</Typography>
                            )}
                        </Box>
                    )}  
                    {/* externista */}
                    {selectedSuccessor === 'externist' && (
                        <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                            <Typography variant="body2"><b>Súčasná pozícia:</b> N/A</Typography>
                            <Typography variant="body2"><b>Oddelenie:</b> N/A</Typography>
                            <Typography variant="body2"><b>Organizácia:</b> N/A</Typography>
                            <Typography variant="body2"><b>Pripravenosť :</b> {leaveReason}</Typography>
                        </Box>
                    )}  
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 4, marginTop: 4 }}>
                    {/* Left Column: TextFields */}
                    <Box sx={{ flex: 1 }}>
                    <Typography variant="body2"><b>Požadované zručnosti: :</b></Typography>
                        {fields.map((field, index) => (
                            <TextField
                                key={index}
                                label={`Zručnosť č. ${index + 1}`}
                                value={field.text}
                                onChange={(e) => handleTextChange(index, e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            />
                        ))}
                    </Box>

                    {/* Right Column: Checkboxes */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2"><b>Súčasné zručnosti: :</b></Typography>
                        {fields.map((field, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={field.checked}
                                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                    />
                                }
                                label={field.checked ? "Spĺňa" : "Nespĺňa"}
                                sx={{ marginBottom: 2 }}
                            />
                        ))}
                    </Box>
                </Box>

                <Stack direction="row" spacing={2} sx={{ display: "flex", flexDirection: "row", marginY: 2 }}>
                    <Button
                        variant="contained"
                        color="info" onClick={handleAddField}
                    >
                        +
                    </Button>
                </Stack>

                {fields.length > 0 && (
                            <Box sx={{ width: "100%", marginTop: 3 }}>
                                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                    Zručnosti: {completedTasks}/{totalTasks} dokončené
                                </Typography>
                                <LinearProgress variant="determinate" value={progress} />
                            </Box>
                        )}
                    </Box>
                
                    
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 4, paddingRight: 3, paddingBottom: 3 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isNotified}
                                onChange={(e) => setIsNotified(e.target.checked)}
                            />
                        }
                        label="Želám si notifikovať priradeného nástupcu po uložení zmien"
                        sx={{ marginRight: 3 }}
                    />
                <Stack direction="row" gap={3} >
                    <Button type="submit" variant="contained" color="info" >
                        Uložiť zmeny
                    </Button>
                    <Button type="button" variant="contained" color="secondary" onClick={() => nav('/manageSuccessions')}>
                        Zrušiť
                    </Button>
                </Stack>
            </Box>

                <EmployeeCardDialog
                    userId={selectedEmployeeCard?.id ?? null}
                    user={selectedEmployeeCard}
                    open={openCardDialog}
                    handleClose={() => setOpenCardDialog(false)}
                />
                </form>
            </Layout>
        );
    
};

export default EditSuccession;


