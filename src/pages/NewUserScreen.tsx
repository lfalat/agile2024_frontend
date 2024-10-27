import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, LinearProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const NewUserScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);
    const [role, setRole] = useState<number | string>(0);
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [titleBefore, setTitleBefore] = useState<string>('');
    const [titleAfter, setTitleAfter] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [matchError, setMatchError] = useState<boolean>(false);
    const [passwordCriteria, setPasswordCriteria] = useState<{
        length: boolean;
        upperCase: boolean;
        lowerCase: boolean;
        number: boolean;
        specialChar: boolean;
    }>({
        length: false,
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false,
    });
    interface Role{
        id_Role: number;
        label: string;
        description: string;
    }
    const [roles, setRoles] = useState<Role[]>([]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordsMatch = password === confirmPassword;

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const inputEmail = e.target.value;
        setEmail(inputEmail);

        if (emailRegex.test(inputEmail)) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    };

    const handleRoleChange = (event: SelectChangeEvent<string | number>) => {
        setRole(event.target.value);
    };

    const navigate = useNavigate();

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        const criteria = {
            length: newPassword.length >= 13,
            upperCase: /[A-Z]/.test(newPassword),
            lowerCase: /[a-z]/.test(newPassword),
            number: /\d/.test(newPassword),
            specialChar: /[^A-Za-z0-9]/.test(newPassword),
        };
        setPasswordCriteria(criteria);
        setPasswordError(!Object.values(criteria).every(Boolean));
        setMatchError(newPassword === confirmPassword);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setMatchError(password === newConfirmPassword);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);

        if (name.trim() === '' || surname.trim() === '') {
            alert('Meno alebo priezvisko sú nevyplnené');
            setError(true);
            return;
        }

        if (passwordError) {
            alert('Heslo má nesprávny formát');
            return;
        }

        if (!matchError) {
            alert('Heslá sa nezhodujú');
            return;
        }

        if (!isValid) {
            return;
        }

        alert(`Submitted: ${email}, ${titleBefore} ${name} ${surname}  ${titleAfter}`);

        setEmail('');
        setName('');
        setSurname('');
        setTitleBefore('');
        setTitleAfter('');
        setPassword('');
        setConfirmPassword('');
        setError(false);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('https://localhost:5092/api/Role');
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, []);
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Vytvorenie nového uživateľa
            </Typography>

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                fullWidth
                required
                error={!isValid}
                helperText={!isValid ? 'Tento formát nieje validný.' : ''}
                variant="outlined"
                margin="normal"
            />

            <FormControl fullWidth margin="normal">
                <InputLabel id="role-select-label">Rola</InputLabel>
                <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={role}
                    label="Rola"
                    onChange={handleRoleChange}
                >
                   {roles.map((role_item) => (
                        <MenuItem key={role_item.id_Role} value={role_item.id_Role}>
                        {role_item.label}
                        </MenuItem>
                    ))} 
                </Select>
            </FormControl>

            <TextField
                label="Heslo"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                error={!passwordError}
                fullWidth
                required
                variant="outlined"
                margin="normal"
            />

            <Box sx={{ width: '100%', marginBottom: 1 }}>
                <LinearProgress variant="determinate" value={Object.values(passwordCriteria).every(Boolean) ? 100 : 0} />
            </Box>

            <Box sx={{ marginTop: 1 }}>
                <Box>
                    <Typography variant="caption" color={passwordCriteria.length ? 'green' : 'red'}>
                        {passwordCriteria.length ? '✔️ Heslo má minimálne 13 znakov.' : '❌ Heslo musí mať minimálne 13 znakov.'}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color={passwordCriteria.upperCase ? 'green' : 'red'}>
                        {passwordCriteria.upperCase ? '✔️ Obsahuje aspoň 1 veľký znak (A-Z).' : '❌ Musí obsahovať aspoň 1 veľký znak (A-Z).'}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color={passwordCriteria.lowerCase ? 'green' : 'red'}>
                        {passwordCriteria.lowerCase ? '✔️ Obsahuje aspoň 1 malý znak (a-z).' : '❌ Musí obsahovať aspoň 1 malý znak (a-z).'}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color={passwordCriteria.number ? 'green' : 'red'}>
                        {passwordCriteria.number ? '✔️ Obsahuje aspoň 1 číslo (0-9).' : '❌ Musí obsahovať aspoň 1 číslo (0-9).'}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color={passwordCriteria.specialChar ? 'green' : 'red'}>
                        {passwordCriteria.specialChar ? '✔️ Obsahuje aspoň 1 špeciálny znak (nie číslo alebo písmeno).' : '❌ Musí obsahovať aspoň 1 špeciálny znak (nie číslo alebo písmeno).'}
                    </Typography>
                </Box>
            </Box>

            <TextField
                label="Potvrdiť heslo"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!matchError}
                fullWidth
                required
                variant="outlined"
                margin="normal"
            />

            <Typography
                variant="caption"
                color={passwordError ? 'red' : matchError ? 'green' : 'red'}
                style={{ marginTop: '8px' }}
            >
                {passwordError
                    ? '❌ Heslo má nesprávny formát.'
                    : matchError
                        ? '✔️ Heslá sa zhodujú.'
                        : '❌ Heslá sa nezhodujú.'}
            </Typography>

            <TextField
                label="Meno"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                error={error && name.trim() === ''}
                helperText={error && name.trim() === '' ? 'Vypíšte meno.' : ''}
                variant="outlined"
                margin="normal"
            />

            <TextField
                label="Priezvisko"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                fullWidth
                required
                error={error && surname.trim() === ''}
                helperText={error && surname.trim() === '' ? 'Vypíšte priezvisko.' : ''}
                variant="outlined"
                margin="normal"
            />

            <TextField
                label="Titul pred"
                value={titleBefore}
                onChange={(e) => setTitleBefore(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
            />

            <TextField
                label="Titul za"
                value={titleAfter}
                onChange={(e) => setTitleAfter(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
            />

            <Button sx={{ marginTop: 5, marginBottom: 10 }} type="submit" variant="contained" size='large' color="success">
                Pridať
            </Button>
            <Button sx={{ marginTop: 5, marginBottom: 10, marginLeft: 2 }} type="button" variant="contained" size='large' color="error" onClick={() => navigate(-1)}>
                zrušiť
            </Button>
        </form>
    );
};


export default NewUserScreen;


