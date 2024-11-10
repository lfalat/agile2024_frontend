import React, { Component, useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Autocomplete, Box, Stack, TextField, Typography, Button, Alert, CircularProgress } from "@mui/material";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../app/api";
import LoadingButton from '@mui/lab/LoadingButton';
import LocationResponse from "../../../types/responses/LocationResponse";

const schema = z.object({
    name: z.string().min(1, {message: "Názov musí byť vyplnený"}),
    code: z.string().min(1,{message: "Kód musí byť vyplnený"}),
    location: z.string().min(1,{message: "Lokalizácia je povinná"}),
    created: z.string()
});

type FormData = z.infer<typeof schema>;

const UpdateOrganization: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Získanie ID organizacie z URL
    const [locationOptions, setLocationOptions] = useState<{ id: string; label: string }[]>([]);
    const nav = useNavigate();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [organizationData, setOrganizationData] = useState< FormData | null >(null);
    const [selectedLocation, setSelectedLocation] = useState<{ id: string; label: string } | null>(null);

    const formattedCreateDate = organizationData
    ? new Date(organizationData.created).toLocaleString("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false // To use 24-hour format
    })
    : "";
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
      });

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

        if (id) {
        api.get(`/Organization/${id}`) 
            .then((res) => {
                const organizationData = res.data;
                setOrganizationData(organizationData);
                setValue("name", organizationData.name);
                setValue("code", organizationData.code);
                setValue("location", organizationData.location.id);
                setValue("created", organizationData.created);    
                setSelectedLocation({id: organizationData.location.id, label: organizationData.location.name});   
            })
            .catch((err) => {
                setError("Nastala chyba pri načítaní údajov o organizácií.");
                nav(-1);
            })
        }
      }, [id, setValue]);

      const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log("Submiting");
        setLoading(true);
        await api.put(`/Organization/Update/${id}`, data)
            .then((res) => {
                nav("/manageOrganizations");
            })
            .catch((err) => {
                setError("Nastala chyba pri aktualizácii organizácie.");
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (organizationData === null) {
        return (
          <Layout>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <CircularProgress />
            </Box>
          </Layout>
        );
      }

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Upraviť organizáciu
                </Typography>
                <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <Alert severity="error" variant="filled">
                            {error}
                        </Alert>
                    )}
                    <TextField label="Názov" required fullWidth {...register("name")} error={!!errors.name} helperText={errors.name?.message ?? ""} slotProps={{ inputLabel: { shrink: true } }}></TextField>
                    <TextField label="Kód" required fullWidth {...register("code")} error={!!errors.code} helperText={errors.code?.message ?? "" } slotProps={{ inputLabel: { shrink: true } }}></TextField>
                    
                    <TextField
                        label="Dátum vytvorenia"
                        fullWidth
                        value={formattedCreateDate}
                        InputProps={{
                            readOnly: true, 
                        }}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={locationOptions} // lokacie
                        getOptionLabel={(option) => option.label}
                        value={selectedLocation}
                        onChange={(_, value) => {
                            setSelectedLocation(value); 
                            setValue("location", value ? value.id : "");
                        }}
                        renderInput={(params) => (
                            <TextField
                                slotProps={{ inputLabel: { shrink: true } }}
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
                            Upraviť organizáciu
                        </LoadingButton>
                        <Button type="button" variant="contained" color="secondary" onClick={() => nav(-1)}>
                            Zrušiť
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Layout>
    );
};

export default UpdateOrganization;