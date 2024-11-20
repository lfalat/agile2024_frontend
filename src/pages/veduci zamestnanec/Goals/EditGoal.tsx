import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Autocomplete, Box, Stack, TextField, Typography, Button, Alert, TextareaAutosize, MenuItem, Select, InputLabel, FormControl, IconButton } from "@mui/material";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../app/api";
import { GoalCategoryResponse } from "../../../types/responses/GoalCategoryResponse";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { EmployeeCard } from "../../../types/EmployeeCard";
import CircleIcon from "@mui/icons-material/Circle";
import { useSnackbar } from '../../../hooks/SnackBarContext';

const schema = z.object({
    name: z.string().min(1, "Názov cieľa je povinný!"),
    description: z.string().min(1, "Popis cieľa je povinný!"),
    goalCategoryId: z.string().min(1, "Kategória cieľa je povinná!").default(""), 
    status: z.string().min(1, "Stav cieľa je povinný!"),
    dueDate: z.string().min(1, "Termín je povinný!"),
    finishedDate: z.string().optional(),
    fullfilmentRate: z.number().min(0, "Miera splnenia musí byť medzi 0 a 100").max(100, "Miera splnenia musí byť medzi 0 a 100").optional(), // Optional completion rate
});

type FormData = z.infer<typeof schema>;

const EditGoal: React.FC = () => {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [error, setError] = useState<string>();
    const [dueDate, setDueDate] = React.useState<Dayjs | null>(dayjs('2024-11-09'));
    const [finishedDate, setFinishedDate] = React.useState<Dayjs | null>(dayjs('2024-11-09'));
    const [categoryOption, setCategoryOptions] = useState<{ id: string; label: string }[]>([]);
    const [goalStatuses, setGoalStatuses] = useState<{ id: string; label: string , color:any }[]>([]); 
    const [showCompletionFields, setShowCompletionFields] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [employeeData, setEmployeeData] = useState<EmployeeCard[]>([]);
    const [employeeIds, setEmployeeIds] = useState<string[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<EmployeeCard[]>([]);
    const { openSnackbar } = useSnackbar();



    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            goalCategoryId: "",
            status: "",
            dueDate: "",
            finishedDate: "",
            fullfilmentRate: undefined,
        }
    });

    useEffect(() => {
        api.get("/GoalCategory/Categories")
            .then((res) => {
                const options = res.data.map((org: GoalCategoryResponse) => ({
                    id: org.id,
                    label: org.description,
                }));
                setCategoryOptions(options);
            })
            .catch((err) => {
                setCategoryOptions([]);
                console.error(err);
            });
            api.get("/EmployeeCard/EmployeeCards")
            .then((res) => {
                setEmployeeData(res.data); 
                console.log("employeeCards", res.data); 
            })
            .catch((err) => console.error("Error fetching employee cards:", err));

            api.get("/GoalStatus/Statuses")
            .then((res) => {
                const statuses = res.data.map((status: { id: string; description: string }) => {
                    let color = "gray"; // Default color
                    if (status.description === "Dokončený") color = "green";
                    else if (status.description === "Prebiehajúci") color = "yellow";
                    else if (status.description === "Nezačatý") color = "gray";
                    else if (status.description === "Zrušený") color = "red";
                    return {
                        id: status.id,
                        label: status.description,
                        color,
                    };
                });
                setGoalStatuses(statuses);
            })
            .catch((err) => console.error("Error fetching goal statuses:", err));
    }, []);

    useEffect(() => {
        if (id) {
            api.get(`/Goal/GoalEmployees/${id}`)
                .then((res) => {
                    setAssignedEmployees(res.data);
                    console.log("Assigned employees:", res.data);
                })
                .catch((err) => console.error("Error fetching assigned employees:", err));
        }
    }, [id]); 

    const columnsUser: GridColDef<EmployeeCard>[] = [
        { field: "name", headerName: "Meno", width: 150 },
        { field: "surname", headerName: "Priezvisko", width: 150 },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            renderCell: (params: { row: any; }) => (
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "orange", color: "black", fontSize: "12px", textWrap: "wrap" }}
                        disabled={employeeIds.includes(params.row.employeeId)}
                        onClick={() => handleAddEmployee(params.row.employeeId)} 
          
                    >
                        Pridať
                    </Button>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleRemoveEmployee(params.row.employeeId)}
          
                        sx={{ color: "red" }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const columnsAssigned: GridColDef<EmployeeCard>[] = [
        { field: "name", headerName: "Meno", width: 150 },
        { field: "surname", headerName: "Priezvisko", width: 150 },
    ];

    const handleDateChange = (newValue: Dayjs | null, context: any) => {
        setDueDate(newValue);
        if (newValue) {
            const adjustedDate = newValue.startOf('day'); 
            const localDate = adjustedDate.toDate();
            const timezoneOffset = localDate.getTimezoneOffset();
            localDate.setMinutes(localDate.getMinutes() - timezoneOffset);
            const isoString = localDate.toISOString();
            setValue("dueDate", isoString);
        }
    };

    const handleDateChangeFinished = (newValue: Dayjs | null, context: any) => {
        setFinishedDate(newValue);
        if (newValue) {
            const adjustedDate = newValue.startOf('day'); 
            const localDate = adjustedDate.toDate();
            const timezoneOffset = localDate.getTimezoneOffset();
            localDate.setMinutes(localDate.getMinutes() - timezoneOffset);
            const isoString = localDate.toISOString();
            setValue("finishedDate", isoString);
        }
        /* else {
            setValue("finishedDate", undefined); 
        }*/
    };

    const handleStatusChange = (value: { id: string, label: string } | null) => {
        const newStatus = value ? value.id : "";
        const newStatusLabel = value ? value.label : "";
        setValue("status", newStatus);
    
        if (newStatusLabel === "Dokončený") {
            setShowCompletionFields(true);
        } else {
            setShowCompletionFields(false);
            setValue("fullfilmentRate", undefined); // Clear value if not completed
            setValue("finishedDate", undefined);   // Clear value if not completed
        }
    };
    

    const handleAddEmployee = (employeeId: string) => {
        if (!employeeIds.includes(employeeId)) {
          setEmployeeIds((prev) => [...prev, employeeId]); 
        }
      };
    
      const handleRemoveEmployee = (employeeId: string) => {
        setEmployeeIds((prev) => prev.filter(id => id !== employeeId)); 
      };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (data.status === "Dokončený") {
            if (data.fullfilmentRate === undefined || data.fullfilmentRate === null) {
                setError("Miera splnenia je povinná pre dokončené ciele.");
                return;
            }
        } else {
            data.fullfilmentRate = undefined;  
            data.finishedDate = undefined;    
        }
        console.log("Submitting form data:", data); 
        await api.put(`/Goal/Edit/${id}`, data)
            .then((res) => {
                console.log("res:", res);
                openSnackbar("Zmeny sa uložili", "success");
                nav('/manageGoals');
            })
            .catch((err) => {
                setError(err.response.data.title);
                console.error(err);
            });
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Editácia cieľa 
                </Typography>

                <Button variant="contained" color="primary"
                    sx={{ marginBottom: 2 }} onClick={() => setShowTable((prev) => !prev)}>
                    Pridať zamestnanca
                </Button>
                {showTable && (
                    <Box sx={{ height: 400, width: "100%", marginBottom: 3 }}>
                         <DataGridPro
                        columns={columnsUser}
                        rows={employeeData}
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
                    />
                    </Box>
                )}

                <Box sx={{ height: 400, width: "100%" }}>
                    <DataGridPro
                        columns={columnsAssigned}
                        rows={assignedEmployees}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                            pinnedColumns: {
                                right: ["actions"],
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        pagination
                        getRowId={(row) => row.id}
                    />
                </Box>
                <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)}>

                    <TextField label="Názov cieľa" required fullWidth {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
                    <TextareaAutosize aria-label="Popis cieľa" required minRows="10" {...register("description")}
                        style={{ resize: "vertical", height: "150px", maxHeight: "300px", overflowY: "auto" }} />
                    <Autocomplete fullWidth options={categoryOption}
                        onChange={(e, value) => {
                            if (value) {
                                setValue("goalCategoryId", value.id);
                            } else {
                                setValue("goalCategoryId", "");
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Kategória cieľa *" />}
                    />

                <Autocomplete fullWidth options={goalStatuses}
                        onChange={(e, value) => handleStatusChange(value)}
                        renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.label}
                            <CircleIcon sx={{ color: option.color, marginLeft: 1 }} />
                            
                        </li>
                    )}
                    getOptionLabel={(option) => option.label} 
                        renderInput={(params) => <TextField {...params} label="Status cieľa *" />
                        }
                    />

                    

                    {showCompletionFields && (
                        <>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Dátum dokončenia *"  value={finishedDate} onChange={handleDateChangeFinished}/>
                            </LocalizationProvider>
                            <TextField label="Miera splnenia" 
                            {...register("fullfilmentRate", {
                                setValueAs: (value) => (value === "" ? undefined : Number(value)),
                              })}
                            required type="number" inputProps={{ min: 0, max: 100 }} helperText={errors.fullfilmentRate ? errors.fullfilmentRate.message : "Zadajte číslo medzi 0 a 100."} 
                            />
                        </>
                    )}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Termín" value={dueDate} onChange={handleDateChange}
                        />
                    </LocalizationProvider>

                    <Stack direction="row" gap={3}>
                        <Button type="submit" variant="contained" color="primary">
                            Uložiť
                        </Button>
                        <Button type="button" variant="contained" color="secondary" onClick={() => nav('/manageGoals')}>
                            Zrušiť
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Layout>
    );
}

export default EditGoal;
