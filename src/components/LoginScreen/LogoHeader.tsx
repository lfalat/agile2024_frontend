import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoHeaderProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ size }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mb: size === 'xs' ? 2 : 4,
        textAlign: 'center',
      }}
    >
      <img
        src="/SHLogo.png"
        alt="Logo"
        style={{
          width: size === 'xs' ? '200px' : '350px',
          height: 'auto',
          marginTop: '20px',
          marginRight: '16px',
        }}
      />
      <Typography
        component="h1"
        variant="h4"
        sx={{
          width: '100%',
          fontSize: size === 'xs' ? '1.8rem' : 'clamp(2.5rem, 10vw, 3rem)',
          fontWeight: 'bold',
          marginTop: size === 'xs' ? '20px' : '40px',
        }}
      >
        Talent Hub
      </Typography>
    </Box>
  );
};

export default LogoHeader;
