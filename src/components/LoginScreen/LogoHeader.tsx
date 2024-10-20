import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LogoHeader() {
  return (
    <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 4,
    textAlign: 'center'
  }}
>
  <img
    src="/SHLogo.png"
    alt="Logo"
    style={{ width: '350px', height: 'auto', marginTop: '20px', marginRight: '16px' }}
  />
  <Typography
    component="h1"
    variant="h4"
    sx={{ width: '100%', fontSize: 'clamp(2.5rem, 10vw, 3rem)' , fontWeight: 'bold', marginTop: '40px',}}
  >
    Talent Hub
  </Typography>
</Box>

  );
}

export {};
