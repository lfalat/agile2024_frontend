import { Message } from "@mui/icons-material";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Autocomplete, Box, Stack, TextField, Typography, Button, Alert } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import api from "../../../app/api";
import LocationResponse from "../../../types/responses/LocationResponse";
import LoadingButton from '@mui/lab/LoadingButton';

const schema = z
    .object({
        name: z.string().min(1, {message: "Názov musí byť vyplnený"}),
        code: z.string().min(1,{message: "Kód musí byť vyplnený"}),
        location: z.string().min(1,{message: "Lokalizácia je povinná"})
    }
    )


type FormData = z.infer<typeof schema>;


const NewOrganization: React.FC = () => {

    const [locationOptions, setLocationOptions] = useState<{ id: string; label: string }[]>([]);
    const nav = useNavigate();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/Location/Locations")
            .then((res) => {
                const options = res.data.map((location: LocationResponse) => ({
                    id: location.id,
                    label: location.name,
                }));
                setLocationOptions(options);
            })
            .catch((err) => {
                setLocationOptions([]);
                console.error(err);
            });
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            code: "",
            location: ""
        },
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setLoading(true);
        api.post("/Organization/Register", data)
            .then((res) => {
                nav(-1);
            })
            .catch((err) => {
                setError(err.response?.data);
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
        });
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Vytvoriť novú organizáciu
                </Typography>
                <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <Alert severity="error" variant="filled">
                            {error}
                        </Alert>
                    )}
                    <TextField label="Názov" required fullWidth {...register("name")} error={!!errors.name} helperText={errors.name?.message ?? ""}></TextField>
                    <TextField label="Kód" required fullWidth {...register("code")} error={!!errors.code} helperText={errors.code?.message ?? ""}></TextField>
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={locationOptions} // lokacie
                        getOptionLabel={(option) => option.label}
                        onChange={(_, value) => {
                            // Update form state with the selected location's id
                            setValue("location", value ? value.id : "");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                label="Lokalita organizácie"
                                error={!!errors.location}
                                helperText={errors.location?.message ?? ""}
                            />
                        )}
                    />
                    <Stack direction="row" gap={3}>
                        <LoadingButton 
                            type="submit" 
                            variant="contained"
                            color="primary"
                            loading={loading}  
                            loadingPosition="start"
                        >
                            Pridať organizáciu
                        </LoadingButton>
                        <Button type="button" variant="contained" color="secondary" onClick={() => nav(-1)}>
                            Zrušiť
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Layout>
        
    );
}

export default NewOrganization