import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Box, Stack, TextField, Typography, Button, Alert, Autocomplete  } from "@mui/material";
import { z } from "zod";
import { useForm, SubmitHandler, Controller  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../app/api";
import useLoading from "../../../hooks/LoadingData";

const schema = z.object({
    name: z.string().min(1, "Názov lokality je povinný!"),
    code: z.string().min(1, "Kód lokality je povinný!"),
    city: z.string().min(1, "Mesto je povinné!"),
    adress: z.string().min(1, "Adresa je povinná!"),
    zipCode: z.string().regex(/^\d+$/, "PSČ musí byť číselné!").min(1, "PSČ je povinné!"),
    organizations: z.array(z.string()).optional(),
    organizationsID: z.array(z.string()).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

// interface LocationResponse extends FormData {
//     organizations: string[]; // Add organizations field
// }

const UpdateLocation: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Získanie ID lokality z URL
    const nav = useNavigate();
    const [error, setError] = useState<string | null>(null);
    //const [loading, setLoading] = useState(true);
    const [locationData, setLocationData] = useState<FormData | null>(null);
    const [organizationOptions, setOrganizationOptions] = useState<{ id: string; label: string }[]>([]);
    //const [location, setLocation] = useState<Location | null>(null);
    //const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
      });


    // Načítanie dát existujúcej lokality podľa ID
    useEffect(() => {
        if (id) {
          api.get(`/Location/${id}`)
            .then((res) => {
              const locationData = res.data;
              setLocationData(locationData);
              // Nastavenie hodnôt do formulára
              setValue("name", locationData.name);
              setValue("code", locationData.code);
              setValue("city", locationData.city);
              setValue("adress", locationData.adress);
              setValue("zipCode", locationData.zipCode);
              setValue("latitude", locationData.latitude);
              setValue("longitude", locationData.longitude);
              setValue("organizations", locationData.organizations || []);
            })
            .catch((err) => {
              setError("Nastala chyba pri načítaní údajov o lokalite.");
              console.error("Error loading location data:", err);
            });
        }
      }, [id, setValue]);

     // Load organization options
     useEffect(() => {
        api.get("/Organization/UnarchivedOrganizations")
            .then((res) => {
                console.log("Organizations fetched:", res.data); // Debugging log
            const formattedOptions = res.data.map((org: string) => ({
                id: org, // Assuming 'org' is a string
                label: org,
            }));
            setOrganizationOptions(formattedOptions);
            })
            .catch((err) => {
                console.error("Error loading organizations:", err);
            });
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            await api.put(`/Location/Update/${id}`, data);
            nav("/manageLocations");
        } catch (err) {
            setError("Nastala chyba pri aktualizácii lokality.");
            console.error(err);
        }
    };

    const loadingIndicator = useLoading(locationData === null);
    if (loadingIndicator) return loadingIndicator;
    
    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Aktualizovať lokalitu
                </Typography>
                
                <Stack direction="column" gap={3} sx={{ width: "100%" }} component="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField label="Názov lokality" required fullWidth {...register("name")} error={!!errors.name} helperText={errors.name?.message}  slotProps={{ inputLabel: { shrink: true } }}/>
                    <TextField label="Kód lokality" required fullWidth {...register("code")} error={!!errors.code} helperText={errors.code?.message}  slotProps={{ inputLabel: { shrink: true } }}/>
                    <TextField label="Mesto" required fullWidth {...register("city")} error={!!errors.city} helperText={errors.city?.message} slotProps={{ inputLabel: { shrink: true } }}/>
                    <TextField label="Adresa" required fullWidth {...register("adress")} error={!!errors.adress} helperText={errors.adress?.message} />
                    <TextField label="PSČ" required fullWidth {...register("zipCode")} InputLabelProps={{ shrink: true }} error={!!errors.zipCode} helperText={errors.zipCode?.message}  slotProps={{ inputLabel: { shrink: true } }}/>
                    <TextField label="Zemepisná šírka" fullWidth type="number" {...register("latitude", { valueAsNumber: true })} error={!!errors.latitude} helperText={errors.latitude?.message}  slotProps={{ inputLabel: { shrink: true } }}/>
                    <TextField label="Zemepisná dĺžka" fullWidth type="number" {...register("longitude", { valueAsNumber: true })} error={!!errors.longitude} helperText={errors.longitude?.message}  slotProps={{ inputLabel: { shrink: true } }}/>
                    {organizationOptions.length > 0 ? (
                    <Controller
                        name="organizations"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                multiple
                                options={organizationOptions}
                                getOptionLabel={(option) => option.label}
                                value={organizationOptions.filter((option) =>
                                    (field.value || []).includes(option.label) // Match by label
                                )}
                                onChange={(_, selectedOptions) => {
                                    field.onChange(selectedOptions.map((option) => option.label)); // Extract labels
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Organizácie"
                                        error={!!errors.organizations}
                                        helperText={errors.organizations?.message}
                                    />
                                )}
                            />
                        )}
                    />
                    ) : (
                        <Typography>Loading organizations...</Typography>
                    )}
                    <Stack direction="row" gap={3}>
                        <Button type="submit" variant="contained" color="primary">
                            Uložiť
                        </Button>
                        <Button type="button" variant="contained" color="secondary" onClick={() => nav("/manageLocations")}>
                            Zrušiť
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Layout>
    );
};

export default UpdateLocation;