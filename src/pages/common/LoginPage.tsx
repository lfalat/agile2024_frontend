import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { z } from "zod"; // Import Zod
import api from "../../app/api";
import { AxiosError } from "axios";

// Create a Zod schema for email validation
const emailSchema = z.string().email("Invalid email format");

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [disabledLogin, setDisabledLogin] = useState<boolean>(true);

    const auth = useAuth();
    const navigate = useNavigate();

    const HandleLogin = async () => {
        setError(undefined);
        setEmailError(undefined); // Reset email error

        // Validate email using Zod
        const emailValidation = emailSchema.safeParse(email);
        if (!emailValidation.success) {
            setEmailError('Neplatný format emailu!');
            return; // Stop if validation fails
        }

        await api
            .post("Auth/Login", {
                email: email,
                password: password,
            })
            .then((res) => {
                const { newJwtToken, newRefreshToken } = res.data;

                localStorage.setItem("accessToken", newJwtToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                api.get("User/Me")
                    .then((res) => {
                        auth.setUserProfile(res.data);
                        navigate("/home", { replace: true });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
                setError(err.response?.data);
            });
    };

    useEffect(() => {
        setDisabledLogin(email.length === 0 || password.length === 0);
    }, [email, password]);

    const HandleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const HandlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    return (
        <Box component={"div"} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <img src="/logo.svg" alt="Siemens Healthineers logo" width="400px" />
            <Typography fontSize="3rem" fontWeight="bold">
                Talent Hub
            </Typography>
            <TextField 
                label="E-mailová adresa" 
                placeholder="email@email.com" 
                sx={{ width: "400px" }} 
                value={email} 
                onChange={HandleEmailChange} 
                error={!!emailError} // Show error if emailError is set
                helperText={emailError} 
            />
            <TextField 
                label="Heslo" 
                type="password" 
                sx={{ width: "400px" }} 
                value={password} 
                onChange={HandlePasswordChange} 
            />
            <Button variant="contained" color="primary" sx={{ width: "400px" }} onClick={HandleLogin} disabled={disabledLogin}>
                Prihlásiť sa
            </Button>
            {error && (
                <Alert severity="error" variant="filled">
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default LoginPage;
