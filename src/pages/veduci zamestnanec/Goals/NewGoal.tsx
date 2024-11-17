import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Autocomplete, Box, Stack, TextField, Typography, Button, Alert, TextareaAutosize, IconButton } from "@mui/material";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import api from "../../../app/api";
import { Message } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { EmployeeCard } from "../../../types/EmployeeCard";
import { GoalCategoryResponse } from "../../../types/responses/GoalCategoryResponse";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import DeleteIcon from "@mui/icons-material/Delete";

const schema = z.object({
    name: z.string().min(1, "Názov cieľa je povinný!"),
    description: z.string().min(1, "Popis cieľa je povinný!"),
    goalCategoryId: z.string().min(1, "Kategória cieľa je povinná!").default(""), 
    dueDate: z.string().min(1, "Termín je povinný!"),
});

type FormData = z.infer<typeof schema>;


const NewGoal: React.FC = () => {
    const nav = useNavigate();
    const [error, setError] = useState<string>();
    const [dueDate, setDueDate] = React.useState<Dayjs | null>(dayjs('2024-11-09'));
    const [categoryOption, setCategoryOptions] = useState<{ id: string; label: string }[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [employeeData, setEmployeeData] = useState<EmployeeCard[]>([]);
    const [employeeIds, setEmployeeIds] = useState<string[]>([]);


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
            dueDate:"",
        }
    });

    const columnsUser: GridColDef<EmployeeCard>[] = [
        //{ field: "email", headerName: "Používateľské meno", width: 200 },
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
        
    }, []);

    const handleAddEmployee = (employeeId: string) => {
        if (!employeeIds.includes(employeeId)) {
          setEmployeeIds((prev) => [...prev, employeeId]); 
        }
      };
    
      const handleRemoveEmployee = (employeeId: string) => {
        setEmployeeIds((prev) => prev.filter(id => id !== employeeId)); 
      };

    const handleDateChange = (newValue: Dayjs | null) => {
        setDueDate(newValue);
        const adjustedDate = newValue ? newValue.startOf('day') : null;
        if (newValue) {
            const adjustedDate = newValue.startOf('day'); 
            const localDate = adjustedDate.toDate();
            const timezoneOffset = localDate.getTimezoneOffset();
            localDate.setMinutes(localDate.getMinutes() - timezoneOffset);
            const isoString = localDate.toISOString();
            setValue("dueDate", isoString);
        }
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
                    Vytvoriť novú lokalitu
                </Typography>

                <Button variant="contained" color="primary"
                    sx={{ marginBottom: 2 }} //onClick={() => { nav("/assignEmployeeToGoal");}}
                    onClick={() => setShowTable((prev) => !prev)}
                
                >
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
                <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)}>
                    
                    <TextField label="Názov cieľa" required fullWidth {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
                    <TextareaAutosize aria-label="Popis cieľa" required minRows = "10" {...register("description")} 
                    style={{
                        resize: "vertical",
                        height: "150px",
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}  />
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Dátum vytvorenia oddelenia"
                            value={dueDate}
                            onChange={(newValue) => handleDateChange(newValue)}
                        />
                                
                    </LocalizationProvider>
                    <Stack direction="row" gap={3}>
                        <Button type="submit" variant="contained" color="primary">
                            Vytvoriť nový cieľ
                        </Button>
                        <Button type="button" variant="contained" color="secondary" onClick={() => nav('/manageLocations')}>
                            Zrušiť
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Layout>
    );
}

export default NewGoal