import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Autocomplete, Box, Stack, TextField, Typography, Button, Alert } from "@mui/material";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import api from "../../../app/api";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OrganizationResponse from "../../../types/responses/OrganizationResponse";
import { Dayjs } from "dayjs";
import { Department } from "../../../types/Department";

const schema = z.object({
    name: z.string().min(1, "Názov oddelenia je povinný!"),
    code: z.string().min(1, "Kód oddelenia je povinný!"),
    organization: z.string().min(1, "Príslušná organizácia je povinná!"),
    parentDepartmentId: z.string().optional(),
    childDepartments: z.array(z.string()).optional(),
    //created: z.instanceof(Dayjs).optional(),
});

type FormData = z.infer<typeof schema>;


const NewDivision: React.FC = () => {

    const nav = useNavigate();
    const [organizationOptions, setOrganizationOptions] = useState<{ id: string; label: string }[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<{ id: string; label: string }[]>([]);
    const [error, setError] = useState<string>();

    useEffect(() => {
        api.get("/Organization/Organizations")
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

        api.get("/Department/UnarchivedDepartments")
            .then((res) => {
                const options = res.data.map((dept: Department) => ({
                    id: dept.id,
                    label: dept.name,
                }));
                setDepartmentOptions(options);
            })
            .catch((err) => {
                setDepartmentOptions([]);
                console.error(err);
            });
    }, []);

    const {
        register: create,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log("clicked")
        console.log("odosielane:", data)
        

        /*api.post("/Department/Create", data)
            .then(() => {
                console.log("data:", data)
                //alert("Zmeny boli úspešne uložené!");
                nav('/manageDivisions')
            })
            .catch((err) => {
                setError(err.response?.data);
                console.error(err);
            });*/

            api.post("/Department/Create", {
                ...data,
                childDepartments: data.childDepartments || [], 
            })
                .then(() => {
                    console.log("Data successfully sent:", data);
                    nav('/manageDivisions');
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
                    Vytvoriť nové oddelenie
                </Typography>
                <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)} >
                    {error && (
                        <Alert severity="error" variant="filled">
                            {error}
                        </Alert>
                    )}
                    <TextField label="Názov oddelenia" required fullWidth  {...create("name")} error={!!errors.name} helperText={errors.name?.message} />
                    <TextField label="Kód oddelenia" required fullWidth  {...create("code")} error={!!errors.code} helperText={errors.code?.message}  />                                    
                    <Autocomplete fullWidth options={organizationOptions}
                        onChange={(e, value) => setValue("organization", value?.id || "")}                 
                        renderInput={(params) => <TextField {...params} label="Príslušná organizácia *" error={!!errors.organization} helperText={errors.organization?.message ?? ""}/>}
                    />

                    <Autocomplete
                        fullWidth
                        options={departmentOptions}
                        onChange={(e, value) => setValue("parentDepartmentId", value?.id)}
                        renderInput={(params) => <TextField {...params} label="Nadradené oddelenie" error={!!errors.parentDepartmentId} helperText={errors.parentDepartmentId?.message ?? ""} />}
                    />

                    <Autocomplete
                        fullWidth
                        multiple
                        options={departmentOptions}
                        onChange={(e, value) => setValue("childDepartments", value.map((v) => v.id))}
                        renderInput={(params) => <TextField {...params} label="Podradené oddelenia" error={!!errors.childDepartments} helperText={errors.childDepartments?.message ?? ""} />}
                    
                    />
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Dátum vytvorenia oddelenia"

                        />
                    </LocalizationProvider>
                    <Stack direction="row" gap={3}>
                        <Button type="submit" variant="contained" color="primary">
                            Pridať oddelenie
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

export default NewDivision