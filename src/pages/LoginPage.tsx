import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusResponse from "../types/responses/StatusResponse";
import useValidation from "../hooks/useValidation"; 
import PasswordStrength from "../components/LoginScreen/PasswordStrength"; 
import ResponsiveComponent from "../components/ResponsiveComponent"; 

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>();
    const [disabledLogin, setDisabledLogin] = useState<boolean>(true);

    const { emailError, emailErrorMessage, passwordError, passwordErrorMessage, passwordStrength, validateInputs } = useValidation();
    const auth = useAuth();
    const navigate = useNavigate();

    const HandleLogin = async () => {
        setError(undefined);
        const isValid = validateInputs(email, password);
        if (!isValid) {
            return;
        }
        var status: StatusResponse = await auth.login(email, password);
        if (status.statusCode === 200) {
            navigate("/home", { replace: true });
        } else {
            setError(status.message);
        }
    };

    useEffect(() => {
        setDisabledLogin(email === null || password === null || email.length === 0 || password.length === 0); 
    }, [email, password]);

    const HandleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const HandlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    return (
        <ResponsiveComponent>
            {({ size }) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        backgroundColor: size === 'xs' ? '#f9f9f9' : '#fff',
                    }}
                >
                    <Stack
                        direction={"column"}
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            maxWidth: size === 'xs' ? 300 : 400,
                            width: "100%",
                            backgroundColor: size === 'xs' ? '#f9f9f9' : '#fff',
                            padding: size === 'xs' ? '20px' : '40px',
                        }}
                    >
                        <img
                            src="/logo.svg"
                            alt="Siemens Healthineers logo"
                            style={{ height: size === 'xs' ? '60px' : '120px' }}
                        />
                        <Typography fontSize="3rem" fontWeight="bold">Talent Hub</Typography>
                        <TextField
                            placeholder="E-mailová adresa"
                            fullWidth
                            value={email}
                            onChange={HandleEmailChange}
                            error={emailError}
                            helperText={emailErrorMessage}
                            sx={{ maxWidth: size === 'xs' ? '100%' : 300 }} 
                        />
                        <TextField
                            placeholder="Heslo"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={HandlePasswordChange}
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            sx={{ maxWidth: size === 'xs' ? '100%' : 300 }} 
                        />
                        <PasswordStrength strength={passwordStrength} />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={HandleLogin}
                            disabled={disabledLogin}
                        >
                            Prihlásiť sa
                        </Button>
                        {error && <Alert severity="error" variant="filled">{error}</Alert>}
                    </Stack>
                </div>
            )}
        </ResponsiveComponent>
    );
};

export default LoginPage;
