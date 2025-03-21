import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import {Autocomplete, Box, Stack, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, LinearProgress } from "@mui/material";
import { z } from "zod";
import {useForm, SubmitHandler, Controller } from "react-hook-form";
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
import { useLocation } from "react-router-dom";



const schema = z.object({
    leavingId: z.string(),
    leavingFullName: z.string(),  
    leavingJobPosition: z.string(),
    leavingDepartment: z.string(),
    reason: z.string(),
    leaveType: z.string(),
    leaveDate: z.string(),
    successorId: z.string().nullable(),
    readyStatus: z.string()
});

type SuccessionData = {
    id: string;
    leavingFullName: string;
    leavingJobPosition: string;
    leavingDepartment: string;
    reason: string;
    leaveDate: string;
    successorFullName: string;
    successorJobPosition: string;
    successorDepartment: string;
    readyStatus: string;
};

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
    //const { id } = useParams(); // Get succession ID from route
    const nav = useNavigate();
    const { openSnackbar } = useSnackbar();
    const { userProfile } = useAuth();
     const { state } = useLocation();
        const { id } = state || {};

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
    const [successionData, setSuccessionData] = useState<SuccessionData | null>(null);
    
    
       

   const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            leavingId: "",
            reason: "",
            leaveType: "",
            leaveDate: "",
            successorId: null,
            readyStatus: ""
        }
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
        //if (!id) return;
        console.log("id:", id);
        api.get(`/Succession/GetById/${id}`).then(res => {
          //const successionData = res.data;
          const successionData = res.data;
          setSuccessionData(res.data);
          console.log("recieved:", res.data);
          reset({
            leavingId: successionData.id,
            leavingFullName: successionData.leavingFullName,
            leavingJobPosition: successionData.leavingJobPosition,
            leavingDepartment: successionData.leavingDepartment,
            reason: successionData.reason,
            leaveDate: successionData.leaveDate,
            //successorFullName: successionData.successorFullName !== "N/A" ? successionData.successorFullName : "",
            //successorJobPosition: successionData.successorJobPosition !== "N/A" ? successionData.successorJobPosition : "",
            //successorDepartment: successionData.successorDepartment !== "N/A" ? successionData.successorDepartment : "",
            readyStatus: successionData.readyStatus
        });

        setSelectedEmployee(successionData.leavingId);
        setSelectedSuccessor(successionData.successorId);
        setFields(successionData.skills || []);
        setIsNotified(successionData.isNotified);

        setLeaveDate(dayjs(successionData.leaveDate)); 
        setLeaveReason(successionData.reason);

        setValue("leavingId", successionData.leavingId);
                        setValue("reason", successionData.leaveReason);
                        setValue("leaveType", successionData.leaveTypeName);
                        setValue("readyStatus", successionData.readyStatus);
                        setValue("leaveDate", successionData.leaveDate );             
        
        }).catch(err => {
          console.error(err);
          openSnackbar("Nepodarilo sa načítať údaje o nástupníctve.", "error");
        });
      }, [id]);

    
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
                        {watch("leavingFullName") || "N/A"}
                    </Typography>

                    <Stack direction="column"  gap={2} sx={{ width: "70%"  }} component="form">
                        <Controller
                            name="leaveDate"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Termín odchodu zamestnanca *"
                                        value={dayjs(field.value)}
                                        onChange={(date) => {
                                            field.onChange(dayjs(date).format("YYYY-MM-DD"));
                                        }}
                                    />                                  
                                </LocalizationProvider>
                            )}
                        />

                        <TextField 
                            label="Dôvod odchodu" 
                            required
                            fullWidth 
                            value={leaveReason} // Nastavenie hodnoty zo stavu
                            //onChange={(e) => setLeaveReason(e.target.value)}
                            {...register("reason")} 
                            error={!!errors.reason} 
                            helperText={errors.reason?.message}
                        />

                        
                        <Controller
                            name="leaveType"
                            control={control}
                            render={({ field }) => (
                            <Autocomplete
                                fullWidth
                                options={leaveTypesOptions}
                                getOptionLabel={(option) => option.label}
                                value={leaveTypesOptions.find(option => option.id === field.value) || null}
                                onChange={(e, value) => field.onChange(value ? value.id : "")}
                                renderInput={(params) => <TextField {...params} label="Typ odchodu" />}
                            />
                            )}
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


