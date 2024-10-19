import React from 'react';
import { Box, CssBaseline, Stack } from '@mui/material';
import LogoHeader from '../components/LoginScreen/LogoHeader';
import CustomCard from '../components/LoginScreen/CustomCard';
import LoginForm from '../components/LoginScreen/LoginForm';
import { useLoginForm } from '../hooks/useLoginForm';

const SignInContainer = {
  minHeight: '100vh',
  padding: 2,
  justifyContent: 'center',  
  alignItems: 'center',      
};

const LoginScreen: React.FC = () => {
  const {
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    emailError,
    emailErrorMessage,
    passwordError,
    passwordErrorMessage,
    passwordStrength,
    errorMessage,
} = useLoginForm();

  return (
    <>
      <CssBaseline />
      <Stack direction="column" sx={SignInContainer}>
        <LogoHeader />

        <CustomCard variant="outlined">
          <Box sx={{ width: '100%' }}>
            <LoginForm
              handleSubmit={handleSubmit}
              handleEmailChange={handleEmailChange}  
              handlePasswordChange={handlePasswordChange} 
              emailError={emailError}
              emailErrorMessage={emailErrorMessage}
              passwordError={passwordError}
              passwordErrorMessage={passwordErrorMessage}
              passwordStrength={passwordStrength}
              errorMessage={errorMessage}
            />
          </Box>
        </CustomCard>
      </Stack>
    </>
  );
};

export default LoginScreen;
