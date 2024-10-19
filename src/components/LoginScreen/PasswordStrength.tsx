import React from 'react';
import { Typography } from '@mui/material';

interface PasswordStrengthProps {
  strength: 'strong' | 'medium' | 'weak';
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ strength }) => {
  return (
    <Typography
      variant="caption"
      color={strength === 'weak' ? 'error' : 'text.secondary'}
    >
      Password strength: {strength}
    </Typography>
  );
};

export default PasswordStrength;
export {};