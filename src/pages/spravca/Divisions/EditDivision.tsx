import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Autocomplete, Box, Stack, TextField, Typography, Button, Alert, AutocompleteChangeReason } from "@mui/material";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../app/api";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OrganizationResponse from "../../../types/responses/OrganizationResponse";
import dayjs, { Dayjs } from "dayjs";
import { Department } from "../../../types/Department";

const schema = z.object({
    name: z.string().min(1, "Názov oddelenia je povinný!"),
    code: z.string().min(1, "Kód oddelenia je povinný!"),
    organization: z.string().min(1, "Príslušná organizácia je povinná!").default(""),
    organizationName: z.string().min(1, "Príslušná organizácia je povinná!").default(""),
    parentDepartmentId: z.string().optional(),
    childDepartments: z.array(z.string()).optional(),
    created: z.string().optional(),
});

type FormData = z.infer<typeof schema>;


const EditDivision: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [organizationOptions, setOrganizationOptions] = useState<{ id: string; label: string }[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<{ id: string; label: string }[]>([]);
    const [error, setError] = useState<string>();
    const [selectedOrganization, setSelectedOrganization] = useState<string>();
    const [createdDate, setCreatedDate] = React.useState<Dayjs | null>(dayjs('2024-11-09'));
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [department, setDepartment] = useState<Department | null>(null);
    const {
        register: create,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });


    useEffect(() => {
        api.get(`/Department/${id}`)
            .then((res) => {
                console.log("prijate data:", res.data);
                const departmentData = res.data;
                const childDepartments = departmentData.childDepartments;
                if (department && department.id === departmentData.id) {
                    return;
                }
                // Aktualizácia stavu s novými dátami
                setDepartment({
                    ...departmentData,
                    childDepartments,
                });
    
                // Nastavovanie hodnôt pre formulár
                setValue("name", departmentData.name);
                setValue("code", departmentData.code);
                setValue("organization", departmentData.organizationId || "");
                setValue("organizationName", departmentData.organizationName || "");
                setValue("parentDepartmentId", departmentData.parentDepartmentId || "");
                setValue("childDepartments", childDepartments);
                setCreatedDate(dayjs(departmentData.created));
            })
            .catch((err) => {
                console.error("Error loading department:", err);
            });
    }, [id, setValue]); // závislosť iba na `id`

    useEffect(() => {
        api.get("/Organization/UnarchivedOrganizations")
            .then((res) => {
                const options = res.data.map((org: OrganizationResponse) => ({
                    id: org.id,
                    label: org.name,
                }));
                setOrganizationOptions(options);
            })
            .catch((err) => {
                setOrganizationOptions([]);
                console.error(err);
            });
    }, []);

    const fetchDepartmentsForOrganization = (organizationId: string) => {
        api.get(`/Department/DepartmentsByOrganization/${organizationId}`)
            .then((res) => {
                const options = res.data.map((dept:Department) => ({
                    id: dept.id,
                    label: dept.name,
                }));
                setDepartmentOptions(options);
            })
            .catch((err) => console.error(err));
    };

    const handleOrganizationChange = (
        event: React.SyntheticEvent,
        value: { id: string; label: string } | null
    ) => {
        const organizationId = value?.id || "";
        setSelectedOrganization(organizationId);
        setValue("organization", value?.id || "");
        if (organizationId) {
            fetchDepartmentsForOrganization(organizationId);
        } else {
            setDepartmentOptions([]);
        }
    };
    

    const handleDateChange = (newValue: Dayjs | null, context: any) => {
        setCreatedDate(newValue);
        if (newValue) {
            const adjustedDate = newValue.startOf('day'); 
            const localDate = adjustedDate.toDate();
            const timezoneOffset = localDate.getTimezoneOffset();
            localDate.setMinutes(localDate.getMinutes() - timezoneOffset);
            const isoString = localDate.toISOString();
            setValue("created", isoString);
            console.log("Adjusted Date:", adjustedDate.format('YYYY-MM-DD'));
            console.log("Local Adjusted ISO String:", isoString);
        }
    };

    


    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log("Data successfully sent:", data);
            api.put(`/Department/Edit/${id}`, {
                
                ...data,
                childDepartments: data.childDepartments || [], 
            })
                .then(() => {
                    
                    console.log("Data successfully sent:", data);
                    setSuccessMessage("Zmeny sa uložili");
                    //nav('/manageDivisions');
                })
                .catch((err) => {
                    setError(err.response?.data);
                    console.error(err);
                });
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Upraviť oddelenie
                </Typography>
                <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)} >
                {error && (
                        <Alert severity="error" variant="filled">
                            {error}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
                            {successMessage}
                        </Alert>
                    
                    )}
                    <TextField label="Názov oddelenia" required fullWidth  {...create("name")} value={watch("name")}error={!!errors.name} helperText={errors.name?.message} slotProps={{ inputLabel: { shrink: true } }}/>
                    <TextField label="Kód oddelenia" required fullWidth  {...create("code")} value={watch("code")} error={!!errors.code} helperText={errors.code?.message}  />                                    
                    <Autocomplete fullWidth options={organizationOptions}  
                        //
                        value={organizationOptions.find((opt) => opt.label === watch("organization")) || null}               
                        /*onChange={(event, newValue) => {
                            setValue("organization", newValue?.label || "");  // Ukladá id organizácie do formulára
                        }}*/
                            onChange={handleOrganizationChange} 
                        renderInput={(params) => <TextField {...params} label="Príslušná organizácia *" error={!!errors.organization} helperText={errors.organization?.message ?? ""}/>}
                    />

                    <Autocomplete
                        fullWidth
                        options={departmentOptions}
                        value={departmentOptions.find((opt) => opt.label === watch("parentDepartmentId")) || null}
                        onChange={(e, value) => setValue("parentDepartmentId", value?.id)}
                        renderInput={(params) => <TextField {...params} label="Nadradené oddelenie" error={!!errors.parentDepartmentId} helperText={errors.parentDepartmentId?.message ?? ""} />}
                    />

                    <Autocomplete
                        fullWidth
                        multiple
                        options={departmentOptions}
                        
                        value={watch("childDepartments")?.map((id: string) => ({
                            id,
                            label: departmentOptions.find((option) => option.id === id)?.label || id,
                        })) || []}
                        onChange={(e, value) => setValue("childDepartments", value.map((v) => v.id))}
                        renderInput={(params) => <TextField {...params} label="Podradené oddelenia" error={!!errors.childDepartments} helperText={errors.childDepartments?.message ?? ""} />}
                    
                    />
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DatePicker
                            label="Dátum vytvorenia oddelenia"
                            value={createdDate}
                            onChange={(newValue, context) => { handleDateChange(newValue, context);}}
                        />
                    </LocalizationProvider>
                    <Stack direction="row" gap={3}>
                        <Button type="submit" variant="contained" color="primary">
                            Uložiť oddelenie
                        </Button>
                        <Button type="button" variant="contained" color="secondary" onClick={() => nav('/manageDivisions')}>
                            Zrušiť
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Layout>
    );
}

export default EditDivision