import React from 'react';
import { Box, CssBaseline, Stack } from '@mui/material';
import LogoHeader from '../components/LoginScreen/LogoHeader';
import CustomCard from '../components/LoginScreen/CustomCard';
import LoginForm from '../components/LoginScreen/LoginForm';
import { useLoginForm } from '../hooks/useLoginForm';
import ResponsiveComponent from '../components/ResponsiveComponent';

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
    <ResponsiveComponent>
      {({ size }) => (
        <>
          <CssBaseline />
          <Stack
            direction="column"
            sx={{
              minHeight: '100vh',
              padding: size === 'xs' ? 2 : 4,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: size === 'xs' ? '#f9f9f9' : '#fff',
            }}
          >
            <LogoHeader size={size} />

            <CustomCard variant="outlined" sx={{ width: size === 'xs' ? '100%' : '50%', maxWidth: 600 }}>
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
      )}
    </ResponsiveComponent>
  );
};

export default LoginScreen;
