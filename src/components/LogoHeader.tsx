import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LogoHeader() {
  return (
    <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 2,
  }}
>
  <img
    src="/SHLogo.png"
    alt="Logo"
    style={{ width: '150px', height: 'auto', marginRight: '16px' }}
  />
  <Typography
    component="h1"
    variant="h4"
    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
  >
    Talent Hub
  </Typography>
</Box>

  );
}

export {};
