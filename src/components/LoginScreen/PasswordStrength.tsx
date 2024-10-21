import React from 'react';
import { Typography } from '@mui/material';

interface PasswordStrengthProps {
  strength: 'silné' | 'stredné' | 'slabé';
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength }) => {
  return (
    <Typography
      variant="caption"
      color={strength === 'slabé' ? 'error' : 'text.secondary'}
    >
      Sila hesla: {strength} heslo
    </Typography>
  );
};

export default PasswordStrength;
export {};