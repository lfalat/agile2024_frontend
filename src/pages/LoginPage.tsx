import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusResponse from "../types/responses/StatusResponse";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>()
    //const [emailError, setEmailError] = useState<string>()
    //const [passwordError, setPasswordError] = useState<string>()
    const [disabledLogin, setDisabledLogin] = useState<boolean>(true)

    const auth = useAuth();
    const navigate = useNavigate()

    const HandleLogin = async () => {
        setError(undefined)
        var status: StatusResponse = await auth.login(email, password)
        if(status.statusCode === 200) {
            navigate('/home', {replace: true})
        } else {
            setError(status.message)
        }
    }

    useEffect(() => {
        //TODO: Implementovat validovanie mailu a hesla
        setDisabledLogin(email === null || password === null || email.length === 0 || password.length === 0)
    },[email, password])

    const HandleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const HandlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Stack direction={"column"} spacing={2} sx={{justifyContent: 'center', alignItems: 'center', maxWidth: 400, width: '100%'}}>
                <img src = '/logo.svg' alt='Siemens Healthineers logo' height='120px'/>
                <Typography fontSize='3rem' fontWeight='bold'>Talent Hub</Typography>
                <TextField placeholder="E-mailová adresa" fullWidth value={email} onChange={HandleEmailChange}/>
                <TextField placeholder="Heslo" type="password" fullWidth value={password} onChange={HandlePasswordChange}/>
                <Button variant="contained" color="primary" fullWidth onClick={HandleLogin} disabled={disabledLogin}>Prihlásiť sa</Button>
                {error && <Alert severity="error" variant="filled">{error}</Alert>}
            </Stack>
        </div>
    );
};

export default LoginPage;