import React from 'react';
import { Box, Button, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import PasswordStrength from './PasswordStrength';

interface LoginFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleEmailChange: (email: string) => void;
  handlePasswordChange: (password: string) => void;
  emailError: boolean;
  emailErrorMessage: string;
  passwordError: boolean;
  passwordErrorMessage: string;
  passwordStrength: 'silné' | 'stredné' | 'slabé';
  errorMessage: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleSubmit,
  handlePasswordChange,
  handleEmailChange,
  
  emailError,
  emailErrorMessage,
  passwordError,
  passwordErrorMessage,
  passwordStrength,
  errorMessage
}) => {
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
      }}
    >
      <FormControl>
        <FormLabel htmlFor="email">Emailová adresa</FormLabel>
        <TextField
          error={emailError}
          helperText={emailErrorMessage}
          id="email"
          type="email"
          name="email"
          placeholder="pouzivatel@email.com"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          variant="outlined"
          color={emailError ? 'error' : 'primary'}
          onChange={(e) => handleEmailChange(e.target.value)}
        
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">Heslo</FormLabel>
        <TextField
          error={passwordError}
          helperText={passwordErrorMessage}
          name="password"
          placeholder="••••••"
          type="password"
          id="password"
          autoComplete="current-password"
          autoFocus
          required
          fullWidth
          variant="outlined"
          color={passwordError ? 'error' : 'primary'}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
        <PasswordStrength strength={passwordStrength} />
      </FormControl>

      {errorMessage && (
        <Typography color="error" variant="body2">
          {errorMessage}
        </Typography>
      )}
      
      <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: '#CC5500', color: 'white' }}>
        Prihlásiť sa
      </Button>
    </Box>
  );
};

export default LoginForm;

export {};
