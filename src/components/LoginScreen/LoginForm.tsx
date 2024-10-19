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
  passwordStrength: 'strong' | 'medium' | 'weak';
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
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          error={emailError}
          helperText={emailErrorMessage}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
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
        <FormLabel htmlFor="password">Password</FormLabel>
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
      
      <Button type="submit" fullWidth variant="contained">
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;

export {};
