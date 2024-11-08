import React, { useEffect, useState } from "react";
import {Box,Button, TextField,Typography,Paper,Divider,} from "@mui/material";
import Grid from '@mui/material/Grid2';
import InfoIcon from '@mui/icons-material/Info';
import { useProfile, ProfileProvider } from "../../hooks/ProfileProvider"
import Layout from "../../components/Layout";
import { useAuth } from "../../hooks/AuthProvider";
import api from "../../app/api";
import { useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

const schema = z.object({
    firstName: z.string().min(1, "Meno je povinné!"),
    lastName: z.string().min(1, "Priezvisko je povinné!"),
    middleName: z.string().optional(),
  });
  
  type FormData = z.infer<typeof schema>;


const ProfilePage: React.FC = () => {
    const nav = useNavigate();
    const { userProfile, setUserProfile } = useAuth();
    const { employeeCard } = useProfile();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
          firstName: employeeCard?.name || '',
          lastName: employeeCard?.surname || '',
          middleName: employeeCard?.middleName || '',
        },
      });

    const handleSaveChanges = async (data: FormData) => {
        try {
          const updatedUserData = {
            name: data.firstName,
            surname: data.lastName,
            middleName: data.middleName,
          };
    
          const response = await api.put(`/Profile/updateProfile/${userProfile?.id}`, updatedUserData);
    
          if (response.status === 200) {
            const updatedUser = await api.get("User/Me");
            setUserProfile(updatedUser.data);
            alert("Zmeny boli úspešne uložené!");
          } else {
            alert("Chyba pri ukladaní zmien!");
          }
        } catch (error) {
          alert("Nastala chyba pri ukladaní zmien!");
        }
      };
    
    return (
        <Layout>
            
            <Box sx={{ width: "100%", margin: "0 auto", p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{paddingLeft: 8}}>Profil</Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{display: "flex",flexDirection: "column",alignItems: "center",}}>
                        <Box 
                            component="img"
                            src="logoSiemens.png"
                            alt="Profile"
                            sx={{ width: "100%",maxWidth: "150px",height: "auto",borderRadius: "8px",marginBottom: 2,}}/>
                        <Button
                            component="label"
                            variant="contained"
                            color="primary"
                            sx={{width: "100%",maxWidth: "300px",textTransform: "none",fontFamily: "Arial, sans-serif",}}
                        >
                            Nahrať fotografiu
                            <input type="file" hidden onChange={(event) => console.log(event.target.files) }/>
                        </Button>
                        <Box
                            sx={{ mt: 2, width: "100%", maxWidth: "300px",  borderRadius: "3px", p: 1, backgroundColor: "#8bdad2",
                                textAlign: "left", display: "flex", alignItems: "flex-start", fontFamily: "Arial, sans-serif",
                            }}
                        >
                            <InfoIcon sx={{ mr: 1, fontSize: 25, color: "#00796b" }} />
                            <Box>
                                Max rozmery obrázka: 400 x 400 px
                                <br />
                                Max veľkosť obrázka: 3 MB
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                        <TextField
                            {...field}
                            label="Meno"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.firstName}
                            helperText={errors.firstName ? errors.firstName.message : ""}
                        />
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                        <TextField
                            {...field}
                            label="Priezvisko"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.lastName}
                            helperText={errors.lastName ? errors.lastName.message : ""}
                        />
                        )}
                    
                    />
                    <Controller
                        name="middleName"
                        control={control}
                        render={({ field }) => (
                        <TextField
                            {...field}
                            label="Stredné meno"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        )}
                    />
                </Grid>
            </Grid>

            
            <Box mt={4}>
            <Divider sx={{ mb: 2, borderColor: "black", borderWidth: 2 }} />
            <Typography variant="h6">Informácie o zamestnancovi</Typography>
            
            <Paper sx={{ p: 2, mt: 1, border:"none", boxShadow: "none" }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }} >
                        <Typography>ID zamestnanca:</Typography>
                        <Typography variant="body2">{employeeCard?.employeeId ?? 'N/A'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Používateľské meno (e-mail):</Typography>
                        <Typography variant="body2">{employeeCard?.email}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Dátum narodenia:</Typography>
                        <Typography variant="body2">{employeeCard?.birthdate}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Pracovná pozícia:</Typography>
                        <Typography variant="body2">{employeeCard?.position}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Dátum nástupu:</Typography>
                        <Typography variant="body2">{employeeCard?.startWorkDate}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Meno:</Typography>
                        <Typography variant="body2">{employeeCard?.name}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Tituly pred menom:</Typography>
                        <Typography variant="body2">{employeeCard?.titleBefore}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Oddelenie:</Typography>
                        <Typography variant="body2">{employeeCard?.department}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Typ zmluvy:</Typography>
                        <Typography variant="body2">{employeeCard?.contractType}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Dĺžka pracovného pomeru:</Typography>
                        <Typography variant="body2"> {employeeCard?.employmentDuration }</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Priezvisko:</Typography>
                        <Typography variant="body2">{employeeCard?.surname}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Tituly za menom:</Typography>
                        <Typography variant="body2">{employeeCard?.titleAfter}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Lokalita:</Typography>
                        <Typography variant="body2">{employeeCard?.location}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Úväzok:</Typography>
                        <Typography variant="body2">{employeeCard?.workPercentage} %</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
                        <Typography>Organizácia:</Typography>
                        <Typography variant="body2">{employeeCard?.organization} </Typography>
                    </Grid>
                    
                </Grid>
            </Paper>
            </Box>

            <Box mt={3} display="flex" justifyContent="left">
                <Button 
                 onClick={handleSubmit(handleSaveChanges)}
                variant="contained" 
                sx={{ mr: 2, textTransform: "none",backgroundColor: "#1f9788",  color: "#fff","&:hover": {backgroundColor: "#28b3a4"} }}
                >
                    Uložiť zmeny
                </Button>
                <Button onClick={() => nav('/home')} variant="outlined"  style={{ color: 'white', textTransform: "none",
                    backgroundColor: 'gray', borderColor: 'gray' }}>
                    Zrušiť
                </Button>
            </Box>
        </Box>
        </Layout>
    );
}

const Profile= () => {
    return (
        <ProfileProvider>
            <ProfilePage />
        </ProfileProvider>
    );
};

export default Profile;

