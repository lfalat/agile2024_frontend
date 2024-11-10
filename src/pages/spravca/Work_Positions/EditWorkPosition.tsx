import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Chip, Snackbar, Stack, Alert } from "@mui/material";
import api from "../../../app/api";
import { useNavigate, useParams } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "../../../components/Layout";
import JobPosition from "../../../types/JobPosition";

type Organization = { id: string; name: string };
type Level = string;
// Define validation schema
const schema = z
    .object({
        id: z.string(),
        name: z.string().min(1, "Názov je poivnný!"),
        code:  z.string().min(1, "Kód je povinný!"),
        levels: z.array(z.string()),//.nonempty("Pracovná pozícia musí mať aspoň jedne level!"),
        organizationsID: z.array(z.string()).nonempty("Pracovná pozícia musí mať aspoň jednu organizáciu!")
    })
type FormData = z.infer<typeof schema>;

const EditWorkPosition: React.FC = () => {
    const { id: id } = useParams();
    const [jobPosition, setJobPosition] = useState<JobPosition[]>();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState<string>();
    const nav = useNavigate();

    useEffect(() => {
        // Fetch organizations for the dropdown list
        api.get("/Organization/GetUnarchaved")
            .then((res) => setOrganizations(res.data))
            .catch((err) => console.error("Failed to load organizations", err));
    }, []);
    useEffect(() => {
        // Fetch job position data
        console.log("Id: " + id);
        if (id) {
            api.get(`/JobPosition/Get?id=${id}`)
                .then((res) => {
                    const jobPosition = res.data;
                    console.log("Načítané dáta");
                    console.log(jobPosition);
                    // Prefill form fields with user data
                    setValue("name", jobPosition.name);
                    setValue("levels", jobPosition.levels.map((x:any) => x.name));
                    setValue("code", jobPosition.code);
                    setValue("organizationsID", jobPosition.organizations.map((x:any) => x.id));
                    //setJobPosition(jobPosition);
                    //setLevels(jobPosition.levels);
                })
                .catch((err) => {
                    console.error("Failed to fetch user data:", err);
                    setError("Nepodarilo sa načítať údaje používateľa.");
                });
        }
    }, []);
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({

        resolver: zodResolver(schema),
        defaultValues: {
            id: id, 
            name: "",
            code: "",
            levels: [],
            organizationsID: []
        },
    });
    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
        api.post("/JobPosition/Edit", data)
            .then((res) => {
                nav(-1);
            })
            .catch((err) => {
                setError(err.response?.data);
                console.error(err);
            });
    };

    const handleCancel = () => {
        nav(-1); // Navigate back to manage page on cancel
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, maxWidth: 600, margin: "0 auto" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Editácia Pracovnej pozície
                </Typography>
                    <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Názov pozície"
                        required
                        fullWidth
                        {...register("name")}
                        error={!!errors.name} helperText={errors.name?.message ?? ""}
                        margin="normal"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <TextField
                        label="Kód pozície"
                        {...register("code")}
                        error={!!errors.code} helperText={errors.code?.message ?? ""}
                        required
                        fullWidth
                        margin="normal"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <InputLabel>Príslušnosť k organizácii</InputLabel>
                    <Controller
                        name="organizationsID"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                multiple
                                id="organization-select"
                                options={organizations}
                                getOptionLabel={(option) => option.name}
                                value={organizations.filter((org) => field.value.includes(org.id))} // Filter by IDs to get the selected organizations
                                onChange={(event, newValue) => {
                                    // Update with an array of organization objects (not just IDs)
                                    field.onChange(newValue.map((org) => org.id)); // Sending just the IDs to the field
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={errors.organizationsID ? "Chyba: Vyberte organizáciu" : "Príslušnosť k organizácii"}
                                        error={!!errors.organizationsID}
                                        helperText={errors.organizationsID?.message ?? ""}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name} // Access name directly as it’s an Organization object now
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                            />
                        )}
                    />


                    <Controller
                        name="levels"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                multiple
                                id="tags-filled"
                                options={levels}
                                freeSolo
                                onChange={(event, newValue) => field.onChange(newValue)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Level"
                                        placeholder="Add Level"
                                        error={!!errors.levels}
                                        helperText={errors.levels?.message ?? ""}
                                    />
                                )}
                            />
                        )}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Uložiť
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                            Zrušiť
                        </Button>
                    </Box>

                    {/* Success Snackbar */}
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={() => setOpenSnackbar(false)}
                        message="Pracovná pozícia bola úspešne vytvorená"
                    />
                </Stack>
            </Box>
        </Layout>
    );
};

export default EditWorkPosition;
